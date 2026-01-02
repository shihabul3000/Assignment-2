import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await authServices.signupUser(name, email, password, phone, role);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const signinUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signinUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};

export const authController = {
    signupUser,
    signinUser,
};