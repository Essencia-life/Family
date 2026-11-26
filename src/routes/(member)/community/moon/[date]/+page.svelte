<script lang="ts">
	import { page } from '$app/state';
	import { ART } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import Player from '#lib/components/Player.svelte';
	import { getMoonRecording } from '#lib/remote/community.remote.ts';

	const r = $derived(await getMoonRecording(page.params.date!));
</script>

<div class="py-8">
	<div class="wrap">
		<a href="/community" class="link">&larr; Community</a>
		<div class="mt-5"><Player video={r} title={r.theme} colors={ART.Meditation.colors} svg={ART.Meditation.svg} /></div>
		<span class="chip mt-9">New moon meeting · {formatDay(r.circle_on)}</span>
		<h1 class="display mt-3 mb-4 text-3xl md:text-4xl">{r.theme}</h1>
		<p class="muted max-w-2xl font-accent text-[1.15rem] italic">{r.invitation}</p>
		<p class="muted mt-4 max-w-2xl text-[0.82rem] italic">
			Shared with the consent of everyone in the circle. Please keep what you hear within the Family.
		</p>
	</div>
</div>
