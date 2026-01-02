import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    const customer_id = req.user?.id;

    try {
        const result = await bookingsService.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    const user = req.user;

    try {
        const result = await bookingsService.getAllBookings(user);
        res.status(200).json({
            success: true,
            message: user?.role === 'admin' ? "Bookings retrieved successfully" : "Your bookings retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user;

    try {
        const result = await bookingsService.updateBooking(parseInt(bookingId), status, user);
        res.status(200).json({
            success: true,
            message: status === 'cancelled' ? "Booking cancelled successfully" : "Booking marked as returned. Vehicle is now available",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const bookingsController = {
    createBooking,
    getAllBookings,
    updateBooking,
};