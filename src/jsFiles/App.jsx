import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import GameCardsList from "../components/GameCardsList";
import GameDetail from "../pages/GameDetail";
import { fetchGames } from "../services/api";

function Home() {
	const [games, setGames] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const userId = 10; // Example user ID, replace with actual logic to get user ID
	const userName = "Rana Saniei"; // Replace with actual user name

	useEffect(() => {
		let mounted = true;
		// setLoading(true);
		fetchGames(userId)
			.then((data) => {
				if (!mounted) return;
				setGames(data || []);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err.message || "Failed to load games");
			})
			.finally(() => mounted && setLoading(false));

		return () => (mounted = false);
	}, []);

	const filteredGames = games
		?.filter((game) =>
			game.name.toLowerCase().includes(searchQuery.toLowerCase()),
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<Layout userName={userName} userId={userId}>
			{/* Page Header */}
			<header className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">Games</h2>
				<p className="text-gray-600">
					Browse and manage your educational games collection
				</p>
			</header>

			{/* Search Bar */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<svg
						className="w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search games by name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
						style={{
							backgroundColor: "#ffffff",
							"--tw-ring-color": "#06b6d4",
							boxShadow: "inset 0 0 0 2px #06b6d4 !important",
						}}
					/>
				</div>
				{searchQuery && (
					<p className="text-sm text-gray-600">
						Found {filteredGames?.length || 0} result
						{filteredGames?.length !== 1 ? "s" : ""}
					</p>
				)}
			</div>

			{/* Content Area */}
			{loading && (
				<div className="flex justify-center py-12">
					<p className="text-sm text-gray-600">Loading games...</p>
				</div>
			)}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}
			{games && <GameCardsList games={filteredGames || games} />}
		</Layout>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/games/:id" element={<GameDetail />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
