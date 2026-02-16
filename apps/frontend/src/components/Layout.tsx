import React from "react";

type Props = {
	children?: React.ReactNode;
	userName?: string;
	userId?: number;
};

export default function Layout({
	children,
	userName = "Dr. Rana Saniei",
	userId = 10,
}: Props) {
	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ backgroundColor: "#ecf0f5" }}
		>
			<nav
				className="shadow-md"
				style={{
					backgroundColor: "#fff8f0",
					borderBottom: "3px solid #ff8f22",
				}}
			>
				<div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div
							className="w-10 h-10 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: "#ff8f22" }}
						>
							<span className="text-white font-bold text-lg">S</span>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">SIMVA</h1>
							<p className="text-xs text-gray-500">
								PUMVA • e-UCM Group • Universidad
								Complutense Madrid
							</p>
						</div>
					</div>

					<div className="text-right">
						<p className="text-sm font-semibold text-gray-900">{userName}</p>
						<p className="text-xs text-gray-500">User ID: {userId}</p>
					</div>
					<button
						className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
						onClick={() => {
							window.location.href = "/api/logout";
						}}
					>
						Logout
					</button>
				</div>
			</nav>

			<main className="flex-1 p-8">
				<div className="max-w-7xl mx-auto">{children}</div>
			</main>

			<footer
				className="shadow-md mt-auto"
				style={{ backgroundColor: "#fff8f0", borderTop: "3px solid #ff8f22" }}
			>
				<div className="max-w-7xl mx-auto px-8 py-6 text-center">
					<p className="text-sm text-gray-600">
						Pumva v1.0 • Simple Validator for Serious Games • Educational Games
						Management System
					</p>
					<p className="text-xs text-gray-500 mt-1">
						© 2026 e-UCM Group, Universidad Complutense Madrid • All rights
						reserved
					</p>
				</div>
			</footer>
		</div>
	);
}
