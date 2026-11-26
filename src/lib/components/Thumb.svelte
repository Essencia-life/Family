<script lang="ts">
	import type { Snippet } from 'svelte';
	import { gradient } from '#lib/content.ts';
	import { thumbnails, type Thumbnail, type Video } from '#lib/video.ts';
	import Cover from './Cover.svelte';

	let {
		colors,
		svg,
		video,
		thumbs,
		portrait = false,
		children
	}: { colors: readonly string[]; svg: string; video?: Partial<Video> | null; thumbs?: Thumbnail[]; portrait?: boolean; children?: Snippet } = $props();
</script>

<div class="thumb" class:p={portrait} style={gradient(colors)}>
	<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html svg}</svg>
	<Cover thumbs={thumbs ?? thumbnails(video)} />
	{@render children?.()}
</div>
