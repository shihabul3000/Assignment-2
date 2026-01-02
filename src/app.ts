import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";

const app = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initializing DB
initDB();

// logger middleware
app.use(logger);

// root route
app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle Rental System API");
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});

export default app;