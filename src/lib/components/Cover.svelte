<script lang="ts">
	import type { Thumbnail } from '#lib/video.ts';

	let { thumbs }: { thumbs: Thumbnail[] } = $props();
	let tried = $state(0);
	const t = $derived(thumbs[tried]);
	// YouTube answers a missing size with a 404 or a 120px grey placeholder: try the next one.
	const next = () => tried++;
</script>

{#if t}
	<img
		class="cover"
		class:letterboxed={t.letterboxed}
		src={t.url}
		alt=""
		loading="lazy"
		onerror={next}
		onload={(e) => (e.currentTarget as HTMLImageElement).naturalWidth <= 120 && next()}
	/>
{/if}
