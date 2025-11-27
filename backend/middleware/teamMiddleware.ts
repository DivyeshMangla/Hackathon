import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Team from "../models/Team";

export const requireTeamLeader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id; // Assumes verifyToken runs first

        const user = await User.findById(userId);
        if (!user || !user.teamId) {
            return res.status(400).json({ message: "You must belong to a team to perform this action" });
        }

        const team = await Team.findById(user.teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.teamLeader !== userId) {
            return res.status(403).json({ message: "Only team leaders can perform this action" });
        }

        // Attach team to request for use in controller
        (req as any).team = team;

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error checking team permissions" });
    }
};
