import React from "react";
import { Link } from "react-router-dom";

function GameCard({ game }: { game: any }) {
	const { name, type, permission, role } = game;

	const getTypeIcon = (gameType: string) => {
		switch (gameType?.toLowerCase()) {
			case "web":
				return "🌐";
			case "desktop":
				return "💻";
			default:
				return "📦";
		}
	};

	const getRoleIcon = (userRole: string) => {
		switch (userRole?.toLowerCase()) {
			case "admin":
				return "👑";
			case "editor":
				return "✏️";
			case "viewer":
				return "👁️";
			case "user":
				return "👤";
			default:
				return "👤";
		}
	};

	return (
		<Link to={`/games/${game.game_id}`} className="block">
			<div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
				<h3 className="text-lg font-semibold mb-3">{name}</h3>

				<div className="space-y-2 text-sm text-gray-600">
					<p>
						<span className="mr-1">{getTypeIcon(type)}</span>
						{type}
					</p>
					<p className="flex items-center gap-2">
						<span
							className="inline-block w-3 h-3 rounded-full"
							style={{
								backgroundColor: permission === "READ" ? "#3b82f6" : "#10b981",
							}}
							title={permission === "READ" ? "Read Only" : "Owner"}
						></span>
						<span className="text-gray-600">
							{permission === "READ" ? "Read" : "Owner"}
						</span>
					</p>
					<p>
						<span className="mr-1">{getRoleIcon(role)}</span>
						{role}
					</p>
				</div>
			</div>
		</Link>
	);
}

export default GameCard;
