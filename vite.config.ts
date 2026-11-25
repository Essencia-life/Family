import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';

// shortcut: @auth/sveltekit 1.x still imports `base` from `$app/paths`, which SvelteKit 3 removed.
// We serve from the root, so `base` is ''. Remove this plugin once @auth/sveltekit supports SvelteKit 3.
const authSvelteKit3 = {
	name: 'auth-sveltekit-3',
	transform(code: string, id: string) {
		if (id.includes('@auth/sveltekit') && code.includes('import { base } from "$app/paths"'))
			return { code: code.replace('import { base } from "$app/paths";', 'const base = "";'), map: null };
	}
};

export default defineConfig({
	plugins: [
		authSvelteKit3,
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			},
			experimental: { remoteFunctions: true },

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
