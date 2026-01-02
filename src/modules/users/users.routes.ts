import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();

// GET /api/v1/users - Admin only
router.get("/", auth("admin"), usersController.getAllUsers);

// PUT /api/v1/users/:userId - Admin or Own
router.put("/:userId", auth("admin", "customer"), usersController.updateUser);

// DELETE /api/v1/users/:userId - Admin only
router.delete("/:userId", auth("admin"), usersController.deleteUser);

export const usersRoutes = router;