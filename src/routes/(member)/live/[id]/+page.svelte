<script lang="ts">
	import { page } from '$app/state';
	import { ART, formatSession } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getLiveSession } from '#lib/remote/community.remote.ts';

	const s = $derived(await getLiveSession(page.params.id!));
	const ended = $derived(new Date(s.starts_at).getTime() + s.minutes * 60e3 < Date.now());
</script>

<div class="py-8">
	<div class="wrap">
		<a href="/community" class="link">&larr; Community</a>
		{#if ended}
			<div class="mt-5"><Player video={s} title={s.title} colors={ART.Meditation.colors} svg={ART.Meditation.svg} /></div>
		{/if}
		<span class="chip mt-9">{ended ? 'Recording' : 'Live'} · {formatSession(s.starts_at)}</span>
		<h1 class="display mt-3 mb-1 text-3xl md:text-4xl">{s.title}</h1>
		<p class="muted mb-4 text-[0.88rem]">with {s.host} · {s.minutes} min · Lisbon time</p>
		<p class="muted max-w-2xl leading-[1.8]">{s.description}</p>
		{#if !ended}
			<div class="mt-6">
				{#if s.join_url}
					<a href={s.join_url} class="btn btn-amber" target="_blank" rel="noopener">Join live &nearr;</a>
				{:else}
					<p class="muted text-[0.85rem] italic">The link to join appears here before the session starts.</p>
				{/if}
			</div>
		{/if}
		<p class="muted mt-8 max-w-2xl text-[0.85rem]">
			How was it for you? <a href="/community#exchange" class="link">Share it in the exchange</a>.
		</p>
	</div>
</div>
