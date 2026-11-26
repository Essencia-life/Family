<script lang="ts">
	let { size }: { size: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" class="shrink-0">
	<circle cx="100" cy="100" r="97" fill="rgba(232,180,85,.07)" />
	<circle cx="100" cy="100" r="88" fill="#0b110e" stroke="rgba(252,250,244,.14)" />
	<path d="M100,12 A88,88 0 0,0 100,188 A120,120 0 0,1 100,12Z" fill="#F4E5B4" />
</svg>
