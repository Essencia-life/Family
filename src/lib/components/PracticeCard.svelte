<script lang="ts">
	import { ART } from '#lib/content.ts';
	import PlayIcon from './PlayIcon.svelte';
	import Thumb from './Thumb.svelte';
	import type { Thumbnail } from '#lib/video.ts';

	type Practice = { id: string; week: number; type: string; title: string; teacher: string; minutes: number; practised?: boolean; video_provider?: string; video_id?: string | null; thumbs?: Thumbnail[]; planned?: boolean; starts_at?: string | null };
	let { practice: p, locked = false }: { practice: Practice; locked?: boolean } = $props();
	const art = $derived(ART[p.type] ?? ART.Yoga);

	// Upcoming live practice: no video yet, so the card shows when it starts, counting down in its last hour.
	let now = $state(Date.now());
	$effect(() => {
		if (!p.planned) return;
		const tick = setInterval(() => (now = Date.now()), 30e3);
		return () => clearInterval(tick);
	});
	const minutesLeft = $derived(p.starts_at ? Math.ceil((Date.parse(p.starts_at) - now) / 60e3) : Infinity);
	const short = (iso: string) =>
		new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' });
</script>

<a href={locked ? '/#pricing' : `/practice/${p.id}`} class="card">
	<Thumb colors={art.colors} svg={art.svg} video={p.planned ? null : p} thumbs={p.planned ? [] : p.thumbs} portrait>
		<span class="chip on-img">{p.planned ? `Live · ${p.type}` : p.type}</span>
		{#if p.planned && p.starts_at}
			<div class="soon">
				<span class="flex items-center gap-2"><i class="rec"></i>{minutesLeft <= 0 ? 'Live now' : 'Upcoming live'}</span>
				<span class="display text-[1.35rem] leading-tight text-stone normal-case tracking-normal">
					{minutesLeft <= 0 ? 'Join now' : minutesLeft <= 60 ? `Starts in ${minutesLeft} min` : short(p.starts_at)}
				</span>
			</div>
		{:else}
			<span class="wk-num">{p.week}</span>
		{/if}
		{#if locked && !p.planned}
			<div class="lock">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
					><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg
				>Members
			</div>
		{:else if !p.planned}
			<span class="play"><PlayIcon /></span>
		{/if}
	</Thumb>
	<p class="meta">{p.minutes} min · with {p.teacher}</p>
	<p class="ttl">{p.title}</p>
	{#if p.practised}<p class="muted text-[0.74rem]">✓ practised</p>{/if}
</a>

<style>
	.soon {
		position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; padding: 1rem;
		border-radius: inherit; border: 1px solid rgba(232, 180, 85, 0.35);
		background: linear-gradient(to top, rgba(8, 12, 9, 0.88), rgba(8, 12, 9, 0.6));
		font-family: var(--font-display); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-glow);
	}
	.rec { width: 8px; height: 8px; border-radius: 50%; background: #e8574a; box-shadow: 0 0 10px 2px rgba(232, 87, 74, 0.6); animation: blink 1.6s ease-in-out infinite; }
	@keyframes blink { 50% { opacity: 0.3; } }
</style>
