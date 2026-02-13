import React from "react";

export default function PermissionItem({ p, onRemove }) {
	return (
		<li className="flex items-center justify-between p-3 bg-white">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
					{(p.username || "?").slice(0, 1).toUpperCase()}
				</div>
				<div>
					<div className="font-medium">{p.username || "—"}</div>
					<div className="text-gray-500 text-xs">{p.role || "—"}</div>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<span
					className={`px-2 py-1 text-xs rounded-full ${
						p.permission === "editor"
							? "bg-blue-100 text-blue-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{p.permission}
				</span>
				<button className="text-red-600 text-sm" onClick={() => onRemove(p.id)}>
					Remove
				</button>
			</div>
		</li>
	);
}
