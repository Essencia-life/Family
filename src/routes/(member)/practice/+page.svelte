<script lang="ts">
	import { PRACTICE_TYPES } from '#lib/content.ts';
	import PracticeCard from '#lib/components/PracticeCard.svelte';
	import { getPractices } from '#lib/remote/content.remote.ts';

	const practices = $derived(await getPractices());
	let filter = $state<string>('All');
	const shown = $derived(filter === 'All' ? practices : practices.filter((p) => p.type === filter));
</script>

<div class="px-6 py-10">
	<div class="container">
		<p class="eyebrow mb-1">Morning practice</p>
		<h1 class="h2 mb-2 text-3xl">Every week, a new morning.</h1>
		<p class="mb-6 text-[0.92rem] opacity-70">Pick a style, or simply start with the newest.</p>
		<div class="mb-8 flex flex-wrap gap-2">
			{#each ['All', ...PRACTICE_TYPES] as t (t)}
				<button class="filter-btn" aria-pressed={filter === t} onclick={() => (filter = t)}>{t}</button>
			{/each}
		</div>
		<div class="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3">
			{#each shown as practice (practice.week)}<PracticeCard {practice} />{/each}
		</div>
		{#if !shown.length}<p class="opacity-60">No {filter} practice yet.</p>{/if}
	</div>
</div>
