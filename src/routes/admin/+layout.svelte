<script lang="ts">
	import { page } from '$app/state';
	import { RESOURCES } from '#lib/admin.ts';

	let { children } = $props();
</script>

<div class="py-10">
	<div class="wrap grid gap-8 md:grid-cols-[12rem_1fr]">
		<nav class="flex flex-wrap gap-2 md:flex-col">
			<a href="/admin" class="eyebrow mb-2">Back-office</a>
			{#each Object.entries(RESOURCES).filter(([, r]) => !r.parent) as [name, r] (name)}
				<a href="/admin/{name}" class="nav-link" aria-current={(RESOURCES[page.params.table ?? '']?.parent?.table ?? page.params.table) === name ? 'page' : undefined}>{r.label}</a>
			{/each}
		</nav>
		<div class="min-w-0">{@render children()}</div>
	</div>
</div>
