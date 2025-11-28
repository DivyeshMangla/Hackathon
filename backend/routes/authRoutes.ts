import { Router } from "express";
import { signup, login, requestOtp, verifyOtp } from "../controllers/authController";

const router = Router();

// Email OTP routes
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

export default router;