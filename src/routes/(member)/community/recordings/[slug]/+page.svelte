<script lang="ts">
	import { page } from '$app/state';
	import { ART } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getRecording } from '#lib/remote/content.remote.ts';

	const r = $derived(await getRecording(page.params.slug!));
	const date = $derived(new Date(r.recorded_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
</script>

<div class="px-6 py-8">
	<div class="container">
		<a href="/community" class="text-[0.85rem] text-terra underline">&larr; Community</a>
		<div class="mt-4"><Player video={r} title={r.title} colors={ART.Forum.colors} svg={ART.Forum.svg} /></div>
		<span class="chip mt-6 inline-block">ZEGG Forum · {date}</span>
		<h1 class="h2 mt-3 mb-4 text-3xl">{r.title}</h1>
		<p class="max-w-2xl text-[0.95rem] leading-[1.8] opacity-80">{r.description}</p>
		<p class="mt-4 max-w-2xl text-[0.8rem] italic opacity-55">
			Shared with the consent of everyone in the circle. Please keep what you hear within the Family.
		</p>
	</div>
</div>
