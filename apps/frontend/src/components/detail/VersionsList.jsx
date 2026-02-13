import React from "react";
import VersionItem from "./VersionItem";

export default function VersionsList({ versions, onView, onDelete }) {
	return (
		<div className="mt-2 text-sm">
			<ul className="divide-y divide-gray-100 border rounded-md overflow-hidden">
				{versions.map((v) => (
					<VersionItem key={v.id} v={v} onView={onView} onDelete={onDelete} />
				))}
			</ul>
		</div>
	);
}
