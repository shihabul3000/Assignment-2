import { pool } from "../../config/db";

const createBooking = async (customer_id: number, vehicle_id: number, rent_start_date: string, rent_end_date: string) => {
    // Check if vehicle exists and is available
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicle.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    if (vehicle.rows[0].availability_status !== 'available') {
        throw new Error("Vehicle is not available");
    }

    // Validate dates
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    if (end <= start) {
        throw new Error("End date must be after start date");
    }

    // Calculate price
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = days * vehicle.rows[0].daily_rent_price;

    // Create booking
    const booking = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    // Update vehicle status
    await pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);

    // Get booking with vehicle info
    const result = await pool.query(
        `SELECT b.*, v.vehicle_name, v.daily_rent_price FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = $1`,
        [booking.rows[0].id]
    );

    return result.rows[0];
};

const getAllBookings = async (user: any) => {
    let query: string;
    let params: any[];
    if (user.role === 'admin') {
        query = `
      SELECT b.*, u.name as customer_name, u.email as customer_email, v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id
    `;
        params = [];
    } else {
        query = `
      SELECT b.*, v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id
    `;
        params = [user.id];
    }

    const result = await pool.query(query, params);
    return result.rows;
};

const updateBooking = async (id: number, status: string, user: any) => {
    // Get booking
    const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
    if (booking.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const b = booking.rows[0];

    if (status === 'cancelled') {
        // Only customer can cancel, and only if before start date
        if (user.role !== 'customer' || b.customer_id !== user.id) {
            throw new Error("Only the customer can cancel their booking");
        }
        if (new Date(b.rent_start_date) <= new Date()) {
            throw new Error("Cannot cancel booking after start date");
        }
        // Update booking and vehicle
        await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [id]);
        await pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [b.vehicle_id]);
        return { ...b, status: 'cancelled' };
    } else if (status === 'returned') {
        // Only admin can mark as returned
        if (user.role !== 'admin') {
            throw new Error("Only admin can mark booking as returned");
        }
        // Update booking and vehicle
        await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [id]);
        await pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [b.vehicle_id]);
        const vehicle = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`, [b.vehicle_id]);
        return { ...b, status: 'returned', vehicle: { availability_status: vehicle.rows[0].availability_status } };
    } else {
        throw new Error("Invalid status");
    }
};

export const bookingsService = {
    createBooking,
    getAllBookings,
    updateBooking,
};