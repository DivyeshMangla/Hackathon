import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {

    try {
        const { name, email, password, rollNumber, year } = req.body;

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