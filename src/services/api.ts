const API_BASE = (import.meta.env.VITE_API_BASE as string) || "";
const API_TOKEN = (import.meta.env.VITE_API_TOKEN as string) || "";

async function handleRes(res: Response) {
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		const err: any = new Error(res.statusText || "API error");
		err.status = res.status;
		err.body = text;
		throw err;
	}
	return res.json().catch(() => null);
}

export async function fetchGames(userId: number) {
	const res = await fetch(`/api/games/user/${userId}`, {
		headers: {
			Authorization: `Bearer ${API_TOKEN}`,
			"Content-Type": "application/json",
		},
	});

	return handleRes(res);
}

export async function fetchGame(userId: number, gameId: string | number) {
	const res = await fetch(`/api/games/user/${userId}`, {
		headers: {
			Authorization: `Bearer ${API_TOKEN}`,
			"Content-Type": "application/json",
		},
	});

	const games: any[] = await handleRes(res);

	const game = games.find((g) => g.game_id == gameId);
	return game;
}

export async function fetchVersions(gameId: number) {
	const res = await fetch(`${API_BASE}/games/${gameId}/versions`);
	return handleRes(res);
}

export async function deleteVersion(gameId: number, versionId: number) {
	const res = await fetch(`${API_BASE}/games/${gameId}/versions/${versionId}`, {
		method: "DELETE",
	});
	return handleRes(res);
}

export async function fetchGuides(gameId: number) {
	const res = await fetch(`${API_BASE}/games/${gameId}/guides`);
	return handleRes(res);
}

export async function addGuide(gameId: number, guide: any) {
	const res = await fetch(`${API_BASE}/games/${gameId}/guides`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(guide),
	});
	return handleRes(res);
}

export async function removeGuide(gameId: number, guideId: number) {
	const res = await fetch(`${API_BASE}/games/${gameId}/guides/${guideId}`, {
		method: "DELETE",
	});
	return handleRes(res);
}

export async function fetchPermissions(gameId: number) {
	const res = await fetch(`${API_BASE}/games/${gameId}/permissions`);
	return handleRes(res);
}

export async function addPermission(gameId: number, payload: any) {
	const res = await fetch(`${API_BASE}/games/${gameId}/permissions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	return handleRes(res);
}

export async function removePermission(gameId: number, permissionId: number) {
	const res = await fetch(
		`${API_BASE}/games/${gameId}/permissions/${permissionId}`,
		{
			method: "DELETE",
		},
	);
	return handleRes(res);
}

export async function fetchSessions(gameId: number) {
	const res = await fetch(`${API_BASE}/games/${gameId}/sessions`);
	return handleRes(res);
}

export default {
	fetchGames,
	fetchGame,
	fetchVersions,
	deleteVersion,
	fetchGuides,
	addGuide,
	removeGuide,
	fetchPermissions,
	addPermission,
	removePermission,
	fetchSessions,
};
