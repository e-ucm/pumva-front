import React from "react";
import GameCard from "./GameCard";

export default function GameCardsList({ games }: { games: any[] | null }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{games?.map((g) => (
				<GameCard key={g.game_id} game={g} />
			))}
		</div>
	);
}
