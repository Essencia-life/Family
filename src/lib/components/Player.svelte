<script lang="ts">
	import { gradient } from '#lib/content.ts';
	import { embedUrl, type Video } from '#lib/video.ts';
	import PlayIcon from './PlayIcon.svelte';

	let { video, title, colors, svg }: { video: Video; title: string; colors: readonly string[]; svg: string } = $props();
	const src = $derived(embedUrl(video));
</script>

<div class="stage">
	<div class="glowbg" style={gradient(colors)}></div>
	<div class="video" style={gradient(colors)}>
		{#if src}
			<iframe
				{src}
				{title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		{:else}
			<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html svg}</svg>
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-stone">
				<span class="bigplay"><PlayIcon size={30} /></span>
				<span class="text-[0.8rem] opacity-85">Video coming soon</span>
			</div>
		{/if}
	</div>
</div>
