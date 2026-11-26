<script lang="ts">
	import { page } from '$app/state';
	import { ART } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getPractice } from '#lib/remote/content.remote.ts';
	import { setPractised } from '#lib/remote/progress.remote.ts';

	const { practice: p, older, newer } = $derived(await getPractice(Number(page.params.week)));
	const art = $derived(ART[p.type] ?? ART.Yoga);
</script>

<div class="py-8">
	<div class="wrap">
		<a href="/practice" class="link">&larr; All practices</a>
		<div class="mt-5"><Player video={p} title={p.title} colors={art.colors} svg={art.svg} /></div>
		<div class="mt-10 grid gap-8 md:grid-cols-[1fr_300px]">
			<div>
				<span class="chip">Week {p.week} · {p.type}</span>
				<h1 class="display mt-3 mb-1 text-3xl md:text-5xl">{p.title}</h1>
				<p class="muted mb-5 text-[0.88rem]">with {p.teacher} · {p.minutes} min</p>
				<p class="muted mb-7 leading-[1.8]">{p.description}</p>
				<button
					class="btn btn-amber"
					disabled={setPractised.pending > 0}
					onclick={() => setPractised({ week: p.week, done: !p.practised })}
				>
					{p.practised ? '✓ Practised' : 'Mark as practised'}
				</button>
			</div>
			<div class="glass self-start">
				<p class="display mb-3 text-xl">Before you start</p>
				<ul class="ticks flex flex-col gap-1.5">
					<li>A quiet corner and a mat or blanket</li>
					<li>Comfortable clothes</li>
					<li>An empty or light stomach</li>
					<li>{p.minutes} minutes, undisturbed</li>
				</ul>
			</div>
		</div>
		<div class="mt-12 flex justify-between border-t border-white/10 pt-5">
			{#if older}<a class="link" href="/practice/{older.week}">&larr; Week {older.week}: {older.title}</a>{:else}<span></span>{/if}
			{#if newer}<a class="link" href="/practice/{newer.week}">Week {newer.week}: {newer.title} &rarr;</a>{/if}
		</div>
	</div>
</div>
