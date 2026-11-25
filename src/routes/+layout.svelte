<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	const user = $derived(data.session?.user);
	const nav = [
		['/home', 'Home'],
		['/practice', 'Practice'],
		['/courses', 'Courses'],
		['/community', 'Community']
	];
	const current = (href: string) => (page.url.pathname.startsWith(href) ? 'page' : undefined);
</script>

<svelte:head>
	<title>Essência Family</title>
</svelte:head>

<header class="sticky top-0 z-30 border-b border-moss/15 bg-stone/85 backdrop-blur">
	<div class="container flex h-16 items-center justify-between">
		<a href={user ? '/home' : '/'} class="font-display text-xl font-medium text-forest">Essência <span class="text-amber">Family</span></a>
		{#if user}
			<nav class="flex items-center gap-5">
				{#each nav as [href, label] (href)}
					<a {href} class="nav-link" aria-current={current(href)}>{label}</a>
				{/each}
				<a
					href="/account"
					class="flex h-8 w-8 items-center justify-center rounded-full bg-moss font-display text-[0.8rem] font-bold text-stone"
					aria-label="Account"
					aria-current={current('/account')}>{(user.name || user.email || '?')[0].toUpperCase()}</a
				>
			</nav>
		{:else}
			<nav class="flex items-center gap-6">
				<a href="/#pricing" class="nav-link hidden md:inline">Membership</a>
				<a href="/auth/signin?callbackUrl=/home" class="nav-link">Log in</a>
				<a href="/#pricing" class="pill-btn bg-forest px-5! py-2! text-stone">Join the Family</a>
			</nav>
		{/if}
	</div>
</header>

<main>
	{@render children()}
</main>

<p class="py-10 text-center text-[0.8rem] text-brown/40 italic">Essência Cooperativa · Aljezur, Portugal · essencia.life</p>
