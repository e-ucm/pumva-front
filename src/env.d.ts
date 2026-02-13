interface ImportMetaEnv {
	readonly VITE_API_BASE?: string;
	readonly VITE_API_TOKEN?: string;
	// add other VITE_ env vars here as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
