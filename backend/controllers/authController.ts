import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {

    try {
        const { name, email, password, rollNumber, year } = req.body;

        // Verify OTP
        if (!verifiedEmails.has(email)) {
            return res.status(400).json({ message: "Please verify OTP before signing up" });
        }
        verifiedEmails.delete(email);

        // Check if email exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400).json({ message: "Email already registered" });
        }


        // Check if roll number exists
        const rollExists = await User.findOne({ rollNumber });
        if (rollExists) {
            res.status(400).json({ message: "Roll Number already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            rollNumber,
            year,
            role: "participant"
        });

        // JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.json({ token, user })
    } catch (error) {
        res.status(500).json({ message: "Signup failed" });
    }
}

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        // Got to make sure the user is registered
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Bcrypt password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.json({ token, user })

    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
}

// Email Auth - OTP
type OtpRecord = { otp: string; expiry: number };
const otpCache = new Map<string, OtpRecord>();       // email -> { otp, expiry }
const verifiedEmails = new Set<string>();            // emails that passed OTP

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export const requestOtp = async (req: Request, res: Response) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Email should not already exist
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Generate OTP + expiry
        const otp = generateOtp();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpCache.set(email, { otp, expiry });

        // TODO: Later replace 'otp' with actual email sending
        return res.status(200).json({
            message: "OTP generated",
            otp //TODO: frontend shows this during dev
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to generate OTP" });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const record = otpCache.get(email);

        if (!record) {
            return res.status(400).json({ message: "OTP not requested or expired" });
        }

        if (Date.now() > record.expiry) {
            otpCache.delete(email);
            return res.status(400).json({ message: "OTP expired" });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Mark email as verified for signup
        verifiedEmails.add(email);
        otpCache.delete(email);

        return res.status(200).json({ message: "OTP verified" });

    } catch (error) {
        return res.status(500).json({ message: "Failed to verify OTP" });
    }
};