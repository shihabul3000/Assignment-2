import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// POST /api/v1/auth/signup
router.post("/signup", authController.signupUser);

// POST /api/v1/auth/signin
router.post("/signin", authController.signinUser);

export const authRoutes = router;