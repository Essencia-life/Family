<script lang="ts">
	import { PRACTICE_TYPES } from '#lib/content.ts';
	import PracticeCard from '#lib/components/PracticeCard.svelte';
	import { getPractices } from '#lib/remote/content.remote.ts';

	const practices = $derived(await getPractices());
	let filter = $state<string>('All');
	const shown = $derived(filter === 'All' ? practices : practices.filter((p) => p.type === filter));
</script>

<div class="py-10">
	<div class="wrap">
		<p class="eyebrow mb-2">Morning practice</p>
		<h1 class="display mb-3 text-4xl md:text-5xl">Every week, <span class="accent">a new morning.</span></h1>
		<p class="muted mb-7">Pick a style, or simply start with the newest.</p>
		<div class="mb-9 flex flex-wrap gap-2">
			{#each ['All', ...PRACTICE_TYPES] as t (t)}
				<button class="filter-btn" aria-pressed={filter === t} onclick={() => (filter = t)}>{t}</button>
			{/each}
		</div>
		<div class="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">
			{#each shown as practice (practice.id)}<PracticeCard {practice} />{/each}
		</div>
		{#if !shown.length}<p class="muted">No {filter} practice yet.</p>{/if}
	</div>
</div>
