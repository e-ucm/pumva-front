import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchGame } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function GameDetail() {
	const { id } = useParams();
	const [game, setGame] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuth();
	const userId = user?.user_id || -1;
	const userName = user?.username || "";

	useEffect(() => {
		// Only fetch game if we have a valid userId and game id
		if (!id || userId === -1) {
			setLoading(false);
			return;
		}

		let mounted = true;
		fetchGame(userId, id as unknown as number)
			.then((g) => mounted && setGame(g))
			.catch(
				(err: any) =>
					mounted && setError(err.message || "Failed to fetch game"),
			)
			.finally(() => mounted && setLoading(false));
		return () => {
			mounted = false;
		};
	}, [id, userId]);

	return (
		<Layout userName={userName} userId={userId}>
			<div className="mb-6">
				<Link to="/" className="text-sm text-orange-500 hover:underline">
					← Back to games
				</Link>
			</div>

			{loading && <p className="text-sm text-gray-600">Loading...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{game && (
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-2xl font-bold mb-2">{game.name}</h2>
					<p className="text-sm text-gray-500 mb-4">{game.description}</p>

					<div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
						<div>
							<strong>Type:</strong> {game.type}
						</div>
						<div>
							<strong>Technology:</strong> {game.technology_name}
						</div>
						<div>
							<strong>Permission:</strong> {game.permission}
						</div>
						<div>
							<strong>Role:</strong> {game.role}
						</div>
						<div>
							<strong>Created:</strong> {game.createdAt}
						</div>
						<div>
							<strong>Updated:</strong> {game.updatedAt}
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
}
