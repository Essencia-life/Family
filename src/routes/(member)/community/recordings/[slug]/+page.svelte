<script lang="ts">
	import { page } from '$app/state';
	import { ART } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getRecording } from '#lib/remote/content.remote.ts';

	const r = $derived(await getRecording(page.params.slug!));
	const date = $derived(new Date(r.recorded_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
</script>

<div class="py-8">
	<div class="wrap">
		<a href="/community" class="link">&larr; Community</a>
		<div class="mt-5"><Player video={r} title={r.title} colors={ART.Forum.colors} svg={ART.Forum.svg} /></div>
		<span class="chip mt-9">ZEGG Forum · {date}</span>
		<h1 class="display mt-3 mb-4 text-3xl md:text-4xl">{r.title}</h1>
		<p class="muted max-w-2xl leading-[1.8]">{r.description}</p>
		<p class="muted mt-4 max-w-2xl text-[0.82rem] italic">
			Shared with the consent of everyone in the circle. Please keep what you hear within the Family.
		</p>
	</div>
</div>
