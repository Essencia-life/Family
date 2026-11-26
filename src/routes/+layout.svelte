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

<header class="top">
	<div class="wrap flex h-16 items-center justify-between">
		<a href={user ? '/home' : '/'} class="logo"><span class="orb"></span><span>Essência <i>Family</i></span></a>
		{#if user}
			<nav class="flex items-center gap-5">
				{#each nav as [href, label] (href)}
					<a {href} class="nav-link" aria-current={current(href)}>{label}</a>
				{/each}
				{#if data.maintainer}<a href="/admin" class="nav-link" aria-current={current('/admin')}>Admin</a>{/if}
				<a
					href="/account"
					class="orb flex h-8 w-8 items-center justify-center rounded-full font-display text-[0.8rem] font-bold text-[#241a08]"
					aria-label="Account"
					aria-current={current('/account')}>{(user.name || user.email || '?')[0].toUpperCase()}</a
				>
			</nav>
		{:else}
			<nav class="flex items-center gap-6">
				<a href="/#pricing" class="nav-link hidden md:inline">Membership</a>
				<a href="/auth/signin?callbackUrl=/home" class="nav-link">Log in</a>
				<a href="/#pricing" class="btn btn-amber btn-sm">Join the Family</a>
			</nav>
		{/if}
	</div>
</header>

<main>
	{@render children()}
</main>

<p class="py-12 text-center text-[0.8rem] text-ink/40 italic">Essência Cooperativa · Aljezur, Portugal · essencia.life</p>
