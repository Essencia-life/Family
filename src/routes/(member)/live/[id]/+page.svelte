<script lang="ts">
	import { page } from '$app/state';
	import { ART, formatSession } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getLiveSession } from '#lib/remote/community.remote.ts';

	const s = $derived(await getLiveSession(page.params.id!));
	const ended = $derived(new Date(s.starts_at).getTime() + s.minutes * 60e3 < Date.now());
</script>

<div class="px-6 py-8">
	<div class="container">
		<a href="/community" class="text-[0.85rem] text-terra underline">&larr; Community</a>
		{#if ended}
			<div class="mt-4"><Player video={s} title={s.title} colors={ART.Meditation.colors} svg={ART.Meditation.svg} /></div>
		{/if}
		<span class="chip mt-6 inline-block">{ended ? 'Recording' : 'Live'} · {formatSession(s.starts_at)}</span>
		<h1 class="h2 mt-3 mb-1 text-3xl">{s.title}</h1>
		<p class="mb-4 text-[0.85rem] opacity-60">with {s.host} · {s.minutes} min · Lisbon time</p>
		<p class="max-w-2xl text-[0.95rem] leading-[1.8] opacity-80">{s.description}</p>
		{#if !ended}
			<div class="mt-6">
				{#if s.join_url}
					<a href={s.join_url} class="pill-btn bg-forest text-stone" target="_blank" rel="noopener">Join live &nearr;</a>
				{:else}
					<p class="text-[0.85rem] italic opacity-60">The link to join appears here before the session starts.</p>
				{/if}
			</div>
		{/if}
		<p class="mt-8 max-w-2xl text-[0.85rem] opacity-70">
			How was it for you? <a href="/community#exchange" class="text-terra underline">Share it in the exchange</a>.
		</p>
	</div>
</div>
