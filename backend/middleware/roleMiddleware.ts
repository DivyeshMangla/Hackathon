export const isJudge = (req: any, res: any, next: any) => {
    if (req.user.role !== "judge" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only judges or admins can view submissions." });
    }
    next();
};