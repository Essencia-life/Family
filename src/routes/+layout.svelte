<script lang="ts">
	import './layout.css';
	import { onNavigate } from '$app/navigation';
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
	const current = (href: string) => ((href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href)) ? 'page' : undefined);
</script>

<svelte:head>
	<title>Essência Family</title>
</svelte:head>

<header class="top">
	<div class="wrap flex h-16 items-center justify-between gap-4">
		<a href="/" class="logo shrink-0 whitespace-nowrap"><span class="orb"></span><span>Essência <i>Family</i></span></a>
		{#if user}
			<!-- Scrolls sideways on phones instead of widening the page. -->
			<nav class="flex min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap md:gap-5" style="scrollbar-width:none">
				{#each nav as [href, label] (href)}
					<a {href} class="nav-link" aria-current={current(href)}>{label}</a>
				{/each}
				{#if data.maintainer}<a href="/admin" class="nav-link" aria-current={current('/admin')}>Admin</a>{/if}
				<Bell />
				<a
					href="/account"
					class="orb flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[0.8rem] font-bold text-[#241a08]"
					aria-label="Account"
					aria-current={current('/account')}>{(user.name || user.email || '?')[0].toUpperCase()}</a
				>
			</nav>
		{:else}
			<nav class="flex items-center gap-6">
				<a href="/#pricing" class="nav-link hidden md:inline">Membership</a>
				<a href="/auth/signin?callbackUrl=/" class="nav-link">Log in</a>
				<a href="/#pricing" class="btn btn-amber btn-sm">Join the Family</a>
			</nav>
		{/if}
	</div>
</header>

<main>
	{@render children()}
</main>

<p class="py-12 text-center text-[0.8rem] text-ink/40 italic">Essência Cooperativa · Aljezur, Portugal · essencia.life</p>
