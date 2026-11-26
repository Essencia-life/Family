<script lang="ts">
	import { ART } from '#lib/content.ts';
	import PlayIcon from './PlayIcon.svelte';
	import Thumb from './Thumb.svelte';

	type Practice = { week: number; type: string; title: string; teacher: string; minutes: number; practised?: boolean; video_provider?: string; video_id?: string | null };
	let { practice: p, locked = false }: { practice: Practice; locked?: boolean } = $props();
	const art = $derived(ART[p.type] ?? ART.Yoga);
</script>

<a href={locked ? '/#pricing' : `/practice/${p.week}`} class="card">
	<Thumb colors={art.colors} svg={art.svg} video={p} portrait>
		<span class="chip on-img">{p.type}</span>
		<span class="wk-num">{p.week}</span>
		{#if locked}
			<div class="lock">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
					><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg
				>Members
			</div>
		{:else}
			<span class="play"><PlayIcon /></span>
		{/if}
	</Thumb>
	<p class="meta">{p.minutes} min · with {p.teacher}</p>
	<p class="ttl">{p.title}</p>
	{#if p.practised}<p class="muted text-[0.74rem]">✓ practised</p>{/if}
</a>
