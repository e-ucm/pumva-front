import React from "react";
import SessionItem from "./SessionItem";

export default function SessionsList({ sessions }) {
	return (
		<div className="mt-2 text-sm">
			<ul className="divide-y divide-gray-100 border rounded-md overflow-hidden">
				{sessions.map((s) => (
					<SessionItem key={s.player_id || s.id} s={s} />
				))}
			</ul>
		</div>
	);
}
