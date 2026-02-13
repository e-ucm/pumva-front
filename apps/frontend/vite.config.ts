import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import config from "./config";

console.log("Vite config loaded with external host:", config.external_host);
// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			// هر درخواستی که با /api شروع بشه به API خارجی فوروارد میشه
			"/api": {
				target: "https://" + config.external_api_host + "/views",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""), // /api حذف میشه
			},
			"/api-bff": "https://" + config.external_host + ":5173/api", // درخواست‌های /api-bff به BFF محلی فوروارد میشه
		},
		allowedHosts: [config.external_host,  "localhost"]
	},
});