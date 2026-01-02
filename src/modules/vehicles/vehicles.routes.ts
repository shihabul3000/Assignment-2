import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

// POST /api/v1/vehicles - Admin only
router.post("/", auth("admin"), vehiclesController.createVehicle);

// GET /api/v1/vehicles - Public
router.get("/", vehiclesController.getAllVehicles);

// GET /api/v1/vehicles/:vehicleId - Public
router.get("/:vehicleId", vehiclesController.getVehicleById);

// PUT /api/v1/vehicles/:vehicleId - Admin only
router.put("/:vehicleId", auth("admin"), vehiclesController.updateVehicle);

// DELETE /api/v1/vehicles/:vehicleId - Admin only
router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteVehicle);

export const vehiclesRoutes = router;