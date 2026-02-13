import express, { json } from "express";
import cors from "cors";
const app = express();
const PORT = 4000;

app.use(cors());
app.use(json());

// --- Mock data ---
const now = () => new Date().toISOString();

let languages = [
	{ language_id: 1, language: "English", createdAt: now(), updatedAt: now() },
	{ language_id: 2, language: "Spanish", createdAt: now(), updatedAt: now() },
	{ language_id: 3, language: "French", createdAt: now(), updatedAt: now() },
	{ language_id: 4, language: "German", createdAt: now(), updatedAt: now() },
];

let technologies = [
	{
		technology_id: 1,
		technology: "Phaser",
		createdAt: now(),
		updatedAt: now(),
	},
	{ technology_id: 2, technology: "Unity", createdAt: now(), updatedAt: now() },
	{ technology_id: 3, technology: "Godot", createdAt: now(), updatedAt: now() },
	{ technology_id: 4, technology: "React", createdAt: now(), updatedAt: now() },
	{
		technology_id: 5,
		technology: "Unreal",
		createdAt: now(),
		updatedAt: now(),
	},
];

let trackers = [
	{ tracker_id: 1, tracker: "GA4", createdAt: now(), updatedAt: now() },
	{ tracker_id: 2, tracker: "Custom", createdAt: now(), updatedAt: now() },
	{ tracker_id: 3, tracker: "Mixpanel", createdAt: now(), updatedAt: now() },
];

let users = [
	{
		user_id: 1,
		username: "alice",
		email: "alice@example.com",
		role: "developer",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 2,
		username: "bob",
		email: "bob@example.com",
		role: "teacher",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 3,
		username: "carol",
		email: "carol@example.com",
		role: "admin",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 4,
		username: "dave",
		email: "dave@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 5,
		username: "eve",
		email: "eve@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 6,
		username: "frank",
		email: "frank@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 7,
		username: "grace",
		email: "grace@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 8,
		username: "heidi",
		email: "heidi@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 9,
		username: "ivan",
		email: "ivan@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 10,
		username: "judy",
		email: "judy@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 11,
		username: "mallory",
		email: "mallory@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		user_id: 12,
		username: "oscar",
		email: "oscar@example.com",
		role: "student",
		createdAt: now(),
		updatedAt: now(),
	},
];

let games = [
	{
		game_id: 1,
		public: true,
		actual: 1,
		name: "Space Explorer",
		description: "Explore the stars and collect resources.",
		owner_Id: 1,
		type: "Arcade",
		technology_id: 1,
		tracker_id: 1,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 2,
		public: false,
		actual: 1,
		name: "Mystic Farm",
		description: "Build and manage your mystical farm.",
		owner_Id: 2,
		type: "Simulation",
		technology_id: 2,
		tracker_id: 2,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 3,
		public: true,
		actual: 1,
		name: "Rogue Quest",
		description: "A procedurally generated roguelike adventure.",
		owner_Id: 3,
		type: "Roguelike",
		technology_id: 3,
		tracker_id: 1,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 4,
		public: true,
		actual: 1,
		name: "Puzzle Blocks",
		description: "Solve puzzles by moving blocks.",
		owner_Id: 4,
		type: "Puzzle",
		technology_id: 4,
		tracker_id: 3,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 5,
		public: false,
		actual: 1,
		name: "Racing Thunder",
		description: "Fast-paced 3D racing.",
		owner_Id: 5,
		type: "Racing",
		technology_id: 5,
		tracker_id: 2,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 6,
		public: true,
		actual: 1,
		name: "Language Lab",
		description: "Learn languages with mini-games.",
		owner_Id: 2,
		type: "Educational",
		technology_id: 4,
		tracker_id: 1,
		createdAt: now(),
		updatedAt: now(),
	},
];

let gamesVersion = [
	{
		game_id: 1,
		version_id: 101,
		version: "1.4.2",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 1,
		version_id: 102,
		version: "1.4.3-beta",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 2,
		version_id: 201,
		version: "2.0.0",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 3,
		version_id: 301,
		version: "0.9.8",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 4,
		version_id: 401,
		version: "1.1.0",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 5,
		version_id: 501,
		version: "3.2.5",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		game_id: 6,
		version_id: 601,
		version: "0.1.0-alpha",
		createdAt: now(),
		updatedAt: now(),
	},
];

let teacherGuides = [
	{
		id: 1,
		game_id: 1,
		language_id: 1,
		url: "https://example.com/space-guide",
		createdAt: now(),
	},
	{
		id: 2,
		game_id: 2,
		language_id: 2,
		url: "https://example.com/farm-guide",
		createdAt: now(),
	},
	{
		id: 3,
		game_id: 3,
		language_id: 1,
		url: "https://example.com/rogue-guide",
		createdAt: now(),
	},
	{
		id: 4,
		game_id: 6,
		language_id: 3,
		url: "https://example.com/langlab-fr",
		createdAt: now(),
	},
];

let gamesPermission = [
	{
		id: 1,
		user_id: 2,
		game_id: 1,
		permission: "viewer",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		id: 2,
		user_id: 3,
		game_id: 1,
		permission: "editor",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		id: 3,
		user_id: 1,
		game_id: 2,
		permission: "editor",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		id: 4,
		user_id: 4,
		game_id: 1,
		permission: "viewer",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		id: 5,
		user_id: 5,
		game_id: 6,
		permission: "viewer",
		createdAt: now(),
		updatedAt: now(),
	},
	{
		id: 6,
		user_id: 6,
		game_id: 4,
		permission: "viewer",
		createdAt: now(),
		updatedAt: now(),
	},
];
// ensure at least 5 users per game in gamesPermission
let _permId = 1;
for (const g of games) {
	// pick up to 5 distinct users for each game (skip owner if necessary)
	let added = 0;
	for (let uIdx = 0; added < 5 && uIdx < users.length; uIdx++) {
		const user = users[(g.game_id - 1 + uIdx) % users.length];
		// avoid duplicate user for same game
		if (
			gamesPermission.find(
				(p) => p.user_id === user.user_id && p.game_id === g.game_id
			)
		)
			continue;
		gamesPermission.push({
			id: _permId++,
			user_id: user.user_id,
			game_id: g.game_id,
			permission: added === 0 ? "editor" : "viewer",
			createdAt: now(),
			updatedAt: now(),
		});
		added++;
	}
}

let sessions = [
	{
		player_id: 1,
		game_id: 1,
		save_path: "/saves/1.sav",
		lastPlayed: now(),
		status: "Active",
	},
	{
		player_id: 2,
		game_id: 1,
		save_path: "/saves/2.sav",
		lastPlayed: now(),
		status: "Completed",
	},
	{
		player_id: 3,
		game_id: 3,
		save_path: "/saves/3.sav",
		lastPlayed: now(),
		status: "Active",
	},
	{
		player_id: 4,
		game_id: 6,
		save_path: "/saves/4.sav",
		lastPlayed: now(),
		status: "Active",
	},
	{
		player_id: 5,
		game_id: 4,
		save_path: "/saves/5.sav",
		lastPlayed: now(),
		status: "Completed",
	},
];

// --- Helpers ---
function findGame(id) {
	return games.find((g) => Number(g.game_id) === Number(id));
}

// --- Routes ---
app.get("/api/games", (req, res) => {
	// return a lightweight list
	const list = games.map((g) => ({
		id: g.game_id,
		name: g.name,
		type: g.type,
		technology_id: g.technology_id,
		languages: languages.map((l) => l.language),
		latestVersion:
			(gamesVersion.filter((v) => v.game_id === g.game_id).slice(-1)[0] || {})
				.version || "",
		visibility: g.public ? "public" : "private",
		owner: users.find((u) => u.user_id === g.owner_Id)?.username || null,
	}));
	res.json(list);
});

app.get("/api/games/:id", (req, res) => {
	const g = findGame(req.params.id);
	if (!g) return res.status(404).json({ error: "not found" });
	const owner = users.find((u) => u.user_id === g.owner_Id);
	res.json({
		id: g.game_id,
		public: g.public,
		actual: g.actual,
		name: g.name,
		description: g.description,
		owner: owner
			? { id: owner.user_id, username: owner.username, email: owner.email }
			: null,
		type: g.type,
		technology: technologies.find((t) => t.technology_id === g.technology_id)
			?.technology,
		tracker: trackers.find((t) => t.tracker_id === g.tracker_id)?.tracker,
		createdAt: g.createdAt,
		updatedAt: g.updatedAt,
	});
});

app.get("/api/games/:id/versions", (req, res) => {
	const id = Number(req.params.id);
	const list = gamesVersion
		.filter((v) => v.game_id === id)
		.map((v) => ({
			id: v.version_id,
			version: v.version,
			externalUrl: `https://example.com/games/${id}/versions/${v.version_id}`,
			createdAt: v.createdAt,
		}));
	res.json(list);
});

app.delete("/api/games/:id/versions/:versionId", (req, res) => {
	const versionId = Number(req.params.versionId);
	const idx = gamesVersion.findIndex((v) => v.version_id === versionId);
	if (idx === -1) return res.status(404).json({ error: "version not found" });
	gamesVersion.splice(idx, 1);
	res.json({ success: true });
});

app.get("/api/games/:id/guides", (req, res) => {
	const id = Number(req.params.id);
	const list = teacherGuides
		.filter((g) => g.game_id === id)
		.map((g) => ({
			id: g.id,
			language:
				languages.find((l) => l.language_id === g.language_id)?.language || "",
			url: g.url,
			createdAt: g.createdAt,
		}));
	res.json(list);
});

app.post("/api/games/:id/guides", (req, res) => {
	const id = Number(req.params.id);
	const { language_id, url, language } = req.body;
	const next = {
		id: Date.now(),
		game_id: id,
		language_id: language_id || 1,
		url: url || "",
		createdAt: now(),
	};
	teacherGuides.push(next);
	res.status(201).json({
		id: next.id,
		language:
			language ||
			languages.find((l) => l.language_id === next.language_id)?.language ||
			"",
		url: next.url,
		createdAt: next.createdAt,
	});
});

app.delete("/api/games/:id/guides/:guideId", (req, res) => {
	const guideId = Number(req.params.guideId);
	const idx = teacherGuides.findIndex((g) => g.id === guideId);
	if (idx === -1) return res.status(404).json({ error: "guide not found" });
	teacherGuides.splice(idx, 1);
	res.json({ success: true });
});

// return users with permission for a game
app.get("/api/games/:id/permissions", (req, res) => {
	const id = Number(req.params.id);
	const perms = gamesPermission
		.filter((p) => p.game_id === id)
		.map((p) => {
			const u = users.find((x) => x.user_id === p.user_id);
			return {
				id: p.id,
				user_id: p.user_id,
				username: u?.username || null,
				permission: p.permission,
				role: u?.role || null,
			};
		});
	res.json(perms);
});

app.post("/api/games/:id/permissions", (req, res) => {
	const id = Number(req.params.id);
	const { user_id, username, permission } = req.body;
	// accept either user_id or username
	let uid = user_id;
	if (!uid && username) {
		const u = users.find((x) => x.username === username);
		if (u) uid = u.user_id;
	}
	if (!uid) return res.status(400).json({ error: "user not found" });
	const next = {
		id: Date.now(),
		user_id: uid,
		game_id: id,
		permission,
		createdAt: now(),
		updatedAt: now(),
	};
	gamesPermission.push(next);
	const u = users.find((x) => x.user_id === uid);
	res.status(201).json({
		id: next.id,
		user_id: uid,
		username: u?.username || null,
		permission: next.permission,
	});
});

app.delete("/api/games/:id/permissions/:permissionId", (req, res) => {
	const id = Number(req.params.permissionId);
	const idx = gamesPermission.findIndex((p) => p.id === id);
	if (idx === -1)
		return res.status(404).json({ error: "permission not found" });
	gamesPermission.splice(idx, 1);
	res.json({ success: true });
});

app.get("/api/games/:id/sessions", (req, res) => {
	const id = Number(req.params.id);
	const list = sessions
		.filter((s) => s.game_id === id)
		.map((s) => ({
			player_id: s.player_id,
			player: `player${s.player_id}`,
			lastPlayed: s.lastPlayed,
			status: s.status,
			save_path: s.save_path,
		}));
	res.json(list);
});

// helpers for other resources
app.get("/api/languages", (req, res) => res.json(languages));
app.get("/api/technologies", (req, res) => res.json(technologies));
app.get("/api/trackers", (req, res) => res.json(trackers));
app.get("/api/users", (req, res) => res.json(users));

app.listen(PORT, () => {
	console.log(`Mock API server running on http://localhost:${PORT}`);
});
