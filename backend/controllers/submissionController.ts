import { Request, Response } from "express";
import Submission from "../models/Submission";

export const createSubmission = async (req: Request, res: Response) => {

    try {
        const teamId = (req as any).teamId;

        // Check if one submission already exists, TODO: Allow updating submission
        const existing = await Submission.findOne({ submittedByTeam: teamId });
        if (existing) {
            return res.status(400).json({ message: "Submission already exists for this team" });
        }

        const { title, description, techStack, videoUrl, figmaUrl, githubRepoUrl, deploymentUrl } = req.body;

        const newSubmission = await Submission.create({
            title,
            description,
            techStack,
            videoUrl,
            figmaUrl,
            githubRepoUrl,
            deploymentUrl,
            submittedByTeam: teamId
        });

        return res.status(201).json({
            message: "Submission created successfully.",
            submission: newSubmission
        });

    } catch (error) {
        return res.status(500).json({ message: "Submission failed." });
    }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
    try {
        const submissions = await Submission.find().sort({ submittedAt: -1 });
        return res.status(200).json(submissions);
    } catch (error) {
        return res.status(500).json({ message: "Could not fetch submissions.", error });
    }
};