import { Router } from "express";
import { createSubmission, getAllSubmissions } from "../controllers/submissionController";
import { verifyToken } from "../middleware/authMiddleware";
import { isTeamLeader } from "../middleware/submissionMiddleware";
import { isJudge } from "../middleware/roleMiddleware";

const router = Router();

// Team leader submits (only once)
router.post("/create", verifyToken, isTeamLeader, createSubmission);

// Judges/Admins view all submissions
router.get("/all", verifyToken, isJudge, getAllSubmissions);

export default router;