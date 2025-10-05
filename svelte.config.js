import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import cloudflare from '@sveltejs/adapter-cloudflare';
import staticAdapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: selectAdapter(),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/digger-ui' : ''
		}
	}
};

function selectAdapter() {
	// GitHub Pages environment
	if (process.env.GITHUB_PAGES) {
		console.log('Using Static adapter (GitHub Pages)');
		return staticAdapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		});
	}

	// Vercel automatically sets this
	if (process.env.VERCEL) {
		console.log('Using Vercel adapter');
		return vercel();
	}

	// Cloudflare Workers environment
	if (process.env.CF_PAGES || process.env.CF_WORKER) {
		console.log('Using Cloudflare adapter');
		return cloudflare();
	}

	// Docker / local / default
	console.log('Using Node adapter (Docker/local)');
	return node({
		out: 'build',
		precompress: true
	});
}

export default config;
