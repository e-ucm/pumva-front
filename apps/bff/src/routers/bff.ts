import { Router, Request, Response } from "express";
import { AuthenticatedRequest } from "./api";
import pumvaAsync from "../libs/pumvaAsync";
import { logger } from "../libs/logger";

const router = Router();
router.get("/users/me", async (req: AuthenticatedRequest, res: Response) => {
    let user = await pumvaAsync.getCurrentUser(req.session.id);
    if (user) {
        logger.info("User found for session " + req.session.id + ": " + JSON.stringify(user));
        res.json(user);
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

export default router;