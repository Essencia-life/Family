<script lang="ts">
	import './layout.css';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Bell from '#lib/components/Bell.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	const user = $derived(data.session?.user);
	const nav = [
		['/', 'Home'],
		['/practice', 'Practice'],
		['/courses', 'Courses'],
		['/community', 'Community']
	];
	// The clicked thumbnail grows into the video player (and back): both carry the view-transition name "video".
	const thumbFor = (path?: string) =>
		path ? document.querySelector<HTMLElement>(`a[href="${path}"].feature, a[href="${path}"] .thumb`) : null;
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			const out = thumbFor(navigation.to?.url.pathname);
			out?.style.setProperty('view-transition-name', 'video');
			document.startViewTransition(async () => {
				out?.style.removeProperty('view-transition-name');
				resolve();
				await navigation.complete;
				thumbFor(navigation.from?.url.pathname)?.style.setProperty('view-transition-name', 'video');
			}).finished.finally(() => thumbFor(navigation.from?.url.pathname)?.style.removeProperty('view-transition-name'));
		});
	});
	// Lets the server greet by the member's local time (see greeting.ts).
	onMount(() => {
		// Browsers without the Cookie Store API simply keep the Lisbon fallback.
		globalThis.cookieStore?.set({ name: 'tz', value: Intl.DateTimeFormat().resolvedOptions().timeZone, path: '/', expires: Date.now() + 365 * 864e5, sameSite: 'lax' });
	});
	const closeMenu = () => document.getElementById('menu')?.hidePopover();
	const current = (href: string) => ((href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href)) ? 'page' : undefined);
</script>

<svelte:head>
	<title>Essência Family</title>
</svelte:head>

<header class="top">
	<div class="wrap flex h-16 items-center justify-between gap-4">
		<a href="/" class="logo shrink-0 whitespace-nowrap"><span class="orb"></span><span>Essência <i>Family</i></span></a>
		{#if user}
			<nav class="flex items-center gap-4 whitespace-nowrap md:gap-5">
				{#each nav as [href, label] (href)}
					<a {href} class="nav-link hidden md:inline" aria-current={current(href)}>{label}</a>
				{/each}
				{#if data.maintainer}<a href="/admin" class="nav-link hidden md:inline" aria-current={current('/admin')}>Admin</a>{/if}
				<Bell />
				<button
					popovertarget="menu"
					class="orb flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full font-display text-[0.8rem] font-bold text-[#241a08]"
					aria-label="Menu">{(user.name || user.email || '?')[0].toUpperCase()}</button
				>
			</nav>
			<!-- On phones the menu holds the whole navigation; on desktop only account and logout. -->
			<div id="menu" popover class="menu glass">
				{#each nav as [href, label] (href)}
					<a {href} class="item block md:hidden" aria-current={current(href)} onclick={closeMenu}>{label}</a>
				{/each}
				{#if data.maintainer}<a href="/admin" class="item block md:hidden" aria-current={current('/admin')} onclick={closeMenu}>Admin</a>{/if}
				<hr class="block md:hidden" />
				<a href="/account" class="item block" aria-current={current('/account')} onclick={closeMenu}>Account</a>
				<form method="POST" action="/account?/logout">
					<input type="hidden" name="redirectTo" value="/" />
					<button class="item block w-full cursor-pointer text-left">Log out</button>
				</form>
			</div>
		{:else}
			<nav class="flex items-center gap-4 whitespace-nowrap md:gap-6">
				<a href="/#pricing" class="nav-link hidden md:inline">Membership</a>
				<a href="/login?callbackUrl=/" class="nav-link">Log in</a>
				<a href="/#pricing" class="btn btn-amber btn-sm">Join<span class="hidden sm:inline"> the Family</span></a>
			</nav>
		{/if}
	</div>
</header>

<main>
	{@render children()}
</main>

<p class="py-12 text-center text-[0.8rem] text-ink/40 italic">Essência Cooperativa · Aljezur, Portugal · essencia.life</p>

<style>
	.menu {
		/* Right edge lines up with the avatar inside the 1120px wrap. */
		position: fixed; inset: 4.5rem max(1rem, calc((100vw - 1120px) / 2 + 1.5rem)) auto auto; margin: 0; width: 13rem; padding: 0.5rem;
		color: var(--color-ink); background: rgba(15, 22, 15, 0.92); backdrop-filter: blur(16px); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
	}
	.item { padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 0.92rem; transition: background 0.2s; }
	.item:hover { background: rgba(252, 250, 244, 0.07); color: var(--color-stone); }
	.item[aria-current='page'] { color: var(--color-glow); }
	hr { margin: 0.4rem 0.8rem; border-color: rgba(252, 250, 244, 0.12); }
</style>
