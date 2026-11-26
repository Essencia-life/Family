<script lang="ts">
	let { pct, class: cls = 'pring' }: { pct: number; class?: string } = $props();
</script>

<svg class={cls} viewBox="0 0 44 44" role="img" aria-label="{pct}% complete">
	<circle cx="22" cy="22" r="18" fill="rgba(8,12,9,.55)" stroke="rgba(252,250,244,.2)" stroke-width="3" />
	<circle cx="22" cy="22" r="18" fill="none" stroke="#e8b455" stroke-width="3" stroke-linecap="round" stroke-dasharray="{(pct * 1.131).toFixed(1)} 113.1" transform="rotate(-90 22 22)" />
	<text x="22" y="25.5" text-anchor="middle" font-size="9.5" fill="#FCFAF4" font-family="Alegreya,serif" font-weight="700">{pct}%</text>
</svg>
