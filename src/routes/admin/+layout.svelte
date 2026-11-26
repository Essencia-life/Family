<script lang="ts">
	import { page } from '$app/state';
	import { RESOURCES } from '#lib/admin.ts';

	let { children } = $props();
</script>

<div class="py-10">
	<div class="wrap grid gap-8 md:grid-cols-[12rem_1fr]">
		<nav class="-mx-6 flex gap-4 overflow-x-auto px-6 whitespace-nowrap md:mx-0 md:flex-col md:gap-2 md:overflow-visible md:px-0">
			<a href="/admin" class="eyebrow self-center md:mb-2 md:self-auto">Back-office</a>
			{#each Object.entries(RESOURCES).filter(([, r]) => !r.parent) as [name, r] (name)}
				<a href="/admin/{name}" class="nav-link" aria-current={(RESOURCES[page.params.table ?? '']?.parent?.table ?? page.params.table) === name ? 'page' : undefined}>{r.label}</a>
			{/each}
			<a href="/admin/exchange" class="nav-link" aria-current={page.url.pathname === '/admin/exchange' ? 'page' : undefined}>Exchange</a>
		</nav>
		<div class="min-w-0">{@render children()}</div>
	</div>
</div>
