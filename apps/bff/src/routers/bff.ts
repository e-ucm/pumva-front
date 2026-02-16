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

router.get("/games", async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session.user?.sql?.user_id;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
    }
    try {
        const games = await pumvaAsync.fetchGames(Number(userId), req.session.id);
        res.json(games);
    } catch (error) {
        logger.error("Error fetching games for user " + userId + ": " + error);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

router.get("/games/:gameId", async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session.user?.sql?.user_id;
    const gameId = req.params.gameId;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
    }
    try {
        const game = await pumvaAsync.fetchGame(Number(userId), gameId, req.session.id);
        if (game) {
            res.json(game);
        } else {
            res.status(404).json({ error: "Game not found" });
        }
    } catch (error) {
        logger.error("Error fetching game " + gameId + " for user " + userId + ": " + error);
        res.status(500).json({ error: "Failed to fetch game" });
    }
});

router.get("/games/:gameId/permissions", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		const permissions = await pumvaAsync.fetchPermissions(Number(gameId), req.session.id);
		res.json(permissions);
	} catch (error) {
		logger.error("Error fetching permissions for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to fetch permissions" });
	}
});

router.post("/games/:gameId/permissions", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		const permissionData = req.body;
		const newPermission = await pumvaAsync.addPermission(Number(gameId), permissionData, req.session.id);
		res.json(newPermission);
	}
	catch (error) {
		logger.error("Error adding permission for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to add permission" });
	}
}
);

router.delete("/games/:gameId/permissions/:permissionId", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const permissionId = req.params.permissionId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		await pumvaAsync.removePermission(Number(gameId), Number(permissionId), req.session.id);
		res.json({ message: "Permission removed successfully" });
	} catch (error) {
		logger.error("Error removing permission " + permissionId + " for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to remove permission" });
	}
});


router.get("/games/:gameId/versions", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		const versions = await pumvaAsync.fetchVersions(Number(gameId), req.session.id);
		res.json(versions);
	} catch (error) {
		logger.error("Error fetching versions for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to fetch versions" });
	}
});

router.delete("/games/:gameId/versions/:versionId", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const versionId = req.params.versionId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		await pumvaAsync.deleteVersion(Number(gameId), Number(versionId), req.session.id);
		res.json({ message: "Version deleted successfully" });
	} catch (error) {
		logger.error("Error deleting version " + versionId + " for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to delete version" });
	}
});

router.get("/games/:gameId/guides", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		const guides = await pumvaAsync.fetchGuides(Number(gameId), req.session.id);
		res.json(guides);
	}
	catch (error) {
		logger.error("Error fetching guides for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to fetch guides" });
	}
});

router.post("/games/:gameId/guides", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		const guide = req.body;
		const newGuide = await pumvaAsync.addGuide(Number(gameId), guide, req.session.id);
		res.json(newGuide);
	}
	catch (error) {
		logger.error("Error adding guide for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to add guide" });
	}
});

router.delete("/games/:gameId/guides/:guideId", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const guideId = req.params.guideId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		await pumvaAsync.removeGuide(Number(gameId), Number(guideId), req.session.id);
		res.json({ message: "Guide removed successfully" });
	}
	catch (error) {
		logger.error("Error removing guide " + guideId + " for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to remove guide" });
	}
});

router.get("/games/:gameId/sessions", async (req: AuthenticatedRequest, res: Response) => {
	const gameId = req.params.gameId;
	const userId = req.session.user?.sql?.user_id;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}
	try {
		const sessions = await pumvaAsync.fetchSessions(Number(gameId), req.session.id);
		res.json(sessions);
	} catch (error) {
		logger.error("Error fetching sessions for game " + gameId + ": " + error);
		res.status(500).json({ error: "Failed to fetch sessions" });
	}
});

export default router;