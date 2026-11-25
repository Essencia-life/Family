<script lang="ts">
	import { page } from '$app/state';
	import { ART } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getPractice } from '#lib/remote/content.remote.ts';
	import { setPractised } from '#lib/remote/progress.remote.ts';

	const { practice: p, older, newer } = $derived(await getPractice(Number(page.params.week)));
	const art = $derived(ART[p.type] ?? ART.Yoga);
</script>

<div class="px-6 py-8">
	<div class="container">
		<a href="/practice" class="text-[0.85rem] text-terra underline">&larr; All practices</a>
		<div class="mt-4"><Player video={p} title={p.title} colors={art.colors} svg={art.svg} /></div>
		<div class="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
			<div>
				<span class="chip">Week {p.week} · {p.type}</span>
				<h1 class="h2 mt-3 mb-1 text-3xl">{p.title}</h1>
				<p class="mb-4 text-[0.85rem] opacity-60">with {p.teacher} · {p.minutes} min</p>
				<p class="mb-6 text-[0.95rem] leading-[1.8] opacity-80">{p.description}</p>
				<button
					class="pill-btn bg-forest text-stone"
					disabled={setPractised.pending > 0}
					onclick={() => setPractised({ week: p.week, done: !p.practised })}
				>
					{p.practised ? '✓ Practised' : 'Mark as practised'}
				</button>
			</div>
			<div class="price">
				<p class="mb-3 font-display font-bold text-forest">Before you start</p>
				<ul class="ticks flex flex-col gap-1.5">
					<li>A quiet corner and a mat or blanket</li>
					<li>Comfortable clothes</li>
					<li>An empty or light stomach</li>
					<li>{p.minutes} minutes, undisturbed</li>
				</ul>
			</div>
		</div>
		<div class="mt-10 flex justify-between border-t border-moss/20 pt-5 text-[0.85rem]">
			{#if older}<a class="text-terra underline" href="/practice/{older.week}">&larr; Week {older.week}: {older.title}</a>{:else}<span></span>{/if}
			{#if newer}<a class="text-terra underline" href="/practice/{newer.week}">Week {newer.week}: {newer.title} &rarr;</a>{/if}
		</div>
	</div>
</div>
