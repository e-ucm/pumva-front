import React from "react";
import GuideItem from "./GuideItem";

export default function GuidesList({ guides, onRemove, onAdd }) {
	return (
		<div className="mt-2 text-sm">
			<ul className="divide-y divide-gray-100 border rounded-md overflow-hidden">
				{guides.map((g) => (
					<GuideItem key={g.id} guide={g} onRemove={onRemove} />
				))}
			</ul>
			<div className="mt-3">
				<button className="text-sm text-blue-600" onClick={onAdd}>
					Add Guide
				</button>
			</div>
		</div>
	);
}
