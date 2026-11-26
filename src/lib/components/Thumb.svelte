<script lang="ts">
	import type { Snippet } from 'svelte';
	import { gradient } from '#lib/content.ts';
	import { thumbnailUrl, type Video } from '#lib/video.ts';

	let {
		colors,
		svg,
		video,
		portrait = false,
		children
	}: { colors: readonly string[]; svg: string; video?: Partial<Video> | null; portrait?: boolean; children?: Snippet } = $props();
	const src = $derived(thumbnailUrl(video));
</script>

<div class="thumb" class:p={portrait} style={gradient(colors)}>
	<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html svg}</svg>
	{#if src}<img class="cover" {src} alt="" loading="lazy" />{/if}
	{@render children?.()}
</div>
