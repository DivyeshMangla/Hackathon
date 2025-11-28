import { Request, Response, NextFunction } from "express";
import Team from "../models/Team";

export const isTeamLeader = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = (req as any).user.id; // Assumes verifyToken runs first
        const teamId = (req as any).teamId;

        if (!teamId) {
            return res.status(401).json({ message: "You are not in a team" });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.teamLeader !== userId) {
            return res.status(403).json({ message: "Only team leaders can perform this action" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Authorization error" });
    }
};