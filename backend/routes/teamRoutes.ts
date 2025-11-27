import { Router } from "express";
import { createTeam, inviteUser, getInvites, acceptInvite, rejectInvite} from "../controllers/teamController";
import { verifyToken } from "../middleware/authMiddleware";
import { requireTeamLeader } from "../middleware/teamMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

router.post("/createTeam", createTeam);
router.post("/inviteUser", requireTeamLeader, inviteUser);
router.get("/getInvites/:userId", getInvites);
router.post("/acceptInvite", acceptInvite);
router.post("/rejectInvite", rejectInvite);

export default router;