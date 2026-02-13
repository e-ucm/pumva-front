import React from "react";

export default function GuideItem({ guide, onRemove }) {
	return (
		<li className="flex items-center justify-between p-3 bg-white">
			<div>
				<div className="font-medium">{guide.language}</div>
				<div className="text-gray-500 text-xs">
					<a href={guide.url} target="_blank" rel="noreferrer">
						{guide.url || "(no url)"}
					</a>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<button
					className="text-red-600 text-sm"
					onClick={() => onRemove(guide.id)}
				>
					Remove
				</button>
			</div>
		</li>
	);
}
