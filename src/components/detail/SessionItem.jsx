import React from "react";

export default function SessionItem({ s }) {
	return (
		<li className="flex items-center justify-between p-3 bg-white">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
					{(s.player || "P").slice(0, 1).toUpperCase()}
				</div>
				<div>
					<div className="font-medium">{s.player}</div>
					<div className="text-gray-500 text-xs">
						{new Date(s.lastPlayed).toLocaleString()}
					</div>
				</div>
			</div>
			<div>
				<span
					className={`px-2 py-1 text-xs rounded ${
						s.status === "Active"
							? "bg-green-100 text-green-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{s.status}
				</span>
			</div>
		</li>
	);
}
