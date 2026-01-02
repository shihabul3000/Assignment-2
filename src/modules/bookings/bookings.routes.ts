import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

// POST /api/v1/bookings - Customer or Admin
router.post("/", auth("customer", "admin"), bookingsController.createBooking);

// GET /api/v1/bookings - Role-based
router.get("/", auth("customer", "admin"), bookingsController.getAllBookings);

// PUT /api/v1/bookings/:bookingId - Role-based
router.put("/:bookingId", auth("customer", "admin"), bookingsController.updateBooking);

export const bookingsRoutes = router;