import React from "react";

export default function VersionItem({ v, onView, onDelete }) {
	return (
		<li className="flex items-center justify-between p-3 bg-white">
			<div>
				<div className="font-medium">Version {v.version}</div>
				<div className="text-gray-500 text-xs">
					{new Date(v.createdAt).toLocaleString()}
				</div>
			</div>
			<div className="flex items-center gap-3">
				<button
					className="text-blue-600 text-sm"
					onClick={() => onView(v.externalUrl)}
				>
					View
				</button>
				<button className="text-red-600 text-sm" onClick={() => onDelete(v.id)}>
					Delete
				</button>
			</div>
		</li>
	);
}
