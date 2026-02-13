import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			// هر درخواستی که با /api شروع بشه به API خارجی فوروارد میشه
			"/api": {
				target: "https://pumva-api.simva-beta2.e-ucm.es/views",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""), // /api حذف میشه
			},
		},
	},
});
