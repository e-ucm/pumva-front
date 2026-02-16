import { Router, Request, Response } from "express";
import { AuthenticatedRequest } from "./api";
import pumvaAsync from "../libs/pumvaAsync";

const router = Router();
router.get("/users/me", async (req: AuthenticatedRequest, res: Response) => {
    let user = await pumvaAsync.getCurrentUser(req.session.id);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

export default router;