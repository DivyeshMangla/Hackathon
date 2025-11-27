import { Request, Response } from "express";
import User from "../models/User";
import Team from "../models/Team";
import TeamInvite from "../models/TeamInvite";

export const createTeam = async (req: Request, res: Response) => {

    try {
        const userId =  (req as any).user.id;
        const { teamName } = req.body;

        // Check if user exists and is in a team
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.teamId) {
            return res.status(400).json({ message: "You already belong to a team" });
        }

        // Create a new team
        const team = await Team.create({
            teamName,
            teamLeader: userId,
            members: [userId]
        });

        user.teamId = team._id.toString();
        await user.save();

        return res.json({ message: "Team created successfully", team });

    } catch (error) {
        res.status(500).json({ message: "Failed to create team" });
    }
};

export const inviteUser = async (req: Request, res: Response) => {

    try {
        const leaderId =  (req as any).user.id;
        const { toUserId } = req.body;
        const team = (req as any).team; // Attached by requireTeamLeader middleware

        // Ensure the invited user exists and is not in a team
        const target = await User.findById(toUserId);
        if (!target) {
            return res.status(404).json({ message: "User to invite not found" });
        }

        if (target.teamId) {
            return res.status(400).json({ message: "User already belongs to a team" });
        }

        // Prevent duplicate invites
        const existingInvite = await TeamInvite.findOne({
            fromUser: leaderId,
            toUser: toUserId,
            teamId: team._id,
            status: "pending"
        });

        if (existingInvite) {
            return res.status(400).json({ message: "An invite has already been sent to this user" });
        }

        // Create invite
        const invite = await TeamInvite.create({
            fromUser: leaderId,
            toUser: toUserId,
            teamId: team._id,
        });

        return res.json({ message: "Invite sent successfully", invite });
    } catch (error) {
        res.status(500).json({ message: "Failed to send invite" });
    }
}

export const getInvites = async (req: Request, res: Response) => {

    try {
        const userId = (req as any).user.id;

        const invites = await TeamInvite.find({
            toUser: userId,
            status: "pending"
        });

        return res.json({ invites });
    } catch (err) {
        res.status(500).json({ message: "Failed to get invites" });
    }
};

export const acceptInvite = async (req: Request, res: Response) => {

    try {
        const userId = (req as any).user.id;
        const { inviteId } = req.body;

        // Check if the invite exists / is valid
        const invite = await TeamInvite.findById(inviteId);
        if (!invite) return res.status(404).json({ message: "Invite not found" });

        // Check if the invite is to this user
        if (invite.toUser !== userId) {
            return res.status(403).json({ message: "You cannot accept this invite" });
        }

        // Check team exists
        const team = await Team.findById(invite.teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });

        // Check team size limit (max 5 members)
        if (team.members.length >= 5) {
            return res.status(400).json({ message: "Team is full" });
        }

        // Update user's team
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.teamId = team._id.toString();
        await user.save();

        // Add user to team's members
        team.members.push(userId);
        await team.save();

        // Mark invite as accepted
        invite.status = "accepted";
        await invite.save();

        // Clear all other invites for that user
        await TeamInvite.deleteMany({
            toUser: userId,
            status: "pending"
        });

        return res.json({ message: "Invite accepted", team });
    } catch (error) {
        res.status(500).json({ message: "Failed to accept invite" });
    }
};

export const rejectInvite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { inviteId } = req.body;

        // Check if the invite exists / is valid
        const invite = await TeamInvite.findById(inviteId);
        if (!invite) return res.status(404).json({ message: "Invite not found" });

        // Check if the invite is this user
        if (invite.toUser !== userId) {
            return res.status(403).json({ message: "You cannot reject this invite" });
        }

        invite.status = "rejected";
        await invite.save();

        return res.json({ message: "Invite rejected" });
    } catch (err) {
        res.status(500).json({ message: "Failed to reject invite" });
    }
};