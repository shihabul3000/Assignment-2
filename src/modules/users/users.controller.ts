import { Request, Response } from "express";
import { usersService } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updates = req.body;
    const user = req.user;

    try {
        // Check permissions: admin can update any, customer only own
        if (user?.role !== 'admin' && user?.id !== parseInt(userId)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You can only update your own profile.",
            });
        }

        const result = await usersService.updateUser(parseInt(userId), updates);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(err.message === "User not found" ? 404 : 500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        await usersService.deleteUser(parseInt(userId));
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err: any) {
        res.status(err.message === "User not found" || err.message === "Cannot delete user with active bookings" ? 400 : 500).json({
            success: false,
            message: err.message,
        });
    }
};

export const usersController = {
    getAllUsers,
    updateUser,
    deleteUser,
};