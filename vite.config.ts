import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	server: {
		// https: {
		// 	key: fs.readFileSync('localhost-key.pem'),
		// 	cert: fs.readFileSync('localhost.pem')
		// },
		host: 'localhost',
		port: 99 // Bisa ubah ke port lain jika diperlukan
	},
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'cookie', 'baseLocale']
		}),
		tailwindcss(),
		sveltekit()
	]
});
