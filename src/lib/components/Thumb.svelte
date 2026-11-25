<script lang="ts">
	import type { Snippet } from 'svelte';
	import { gradient } from '#lib/content.ts';

	let { colors, svg, children }: { colors: readonly string[]; svg: string; children?: Snippet } = $props();
</script>

<div class="thumb" style={gradient(colors)}>
	<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html svg}</svg>
	{@render children?.()}
</div>
