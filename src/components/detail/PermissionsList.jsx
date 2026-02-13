import React from "react";
import PermissionItem from "./PermissionItem";

export default function PermissionsList({ permissions, onAdd, onRemove }) {
	return (
		<div className="mt-2 text-sm">
			<ul className="divide-y divide-gray-100 border rounded-md overflow-hidden">
				{permissions.map((p) => (
					<PermissionItem key={p.id} p={p} onRemove={onRemove} />
				))}
			</ul>
			<div className="mt-3">
				<button className="text-sm text-blue-600" onClick={onAdd}>
					Add Permission
				</button>
			</div>
		</div>
	);
}
