import { pool } from "../../config/db";

const createVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string = 'available') => {
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    return result.rows[0];
};

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles ORDER BY id`);
    return result.rows;
};

const getVehicleById = async (id: number) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    return result.rows[0];
};

const updateVehicle = async (id: number, updates: any) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    }

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
};

const deleteVehicle = async (id: number) => {
    // Check for active bookings
    const activeBookings = await pool.query(`SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [id]);
    if (activeBookings.rows.length > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }

    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
};

export const vehiclesService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};