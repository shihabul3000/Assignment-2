import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const result = await vehiclesService.createVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.getAllVehicles();
        res.status(200).json({
            success: true,
            message: result.length > 0 ? "Vehicles retrieved successfully" : "No vehicles found",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;

    try {
        const result = await vehiclesService.getVehicleById(parseInt(vehicleId));
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(err.message === "Vehicle not found" ? 404 : 500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const updates = req.body;

    try {
        const result = await vehiclesService.updateVehicle(parseInt(vehicleId), updates);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(err.message === "Vehicle not found" ? 404 : 500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;

    try {
        await vehiclesService.deleteVehicle(parseInt(vehicleId));
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (err: any) {
        res.status(err.message === "Vehicle not found" || err.message === "Cannot delete vehicle with active bookings" ? 400 : 500).json({
            success: false,
            message: err.message,
        });
    }
};

export const vehiclesController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};