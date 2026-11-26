<script lang="ts">
	import { RESOURCES } from '#lib/admin.ts';
</script>

<h1 class="h2 mb-2 text-3xl">Back-office</h1>
<p class="mb-8 opacity-70">Edit what members see. Changes are live right away.</p>
<div class="grid gap-3 sm:grid-cols-2">
	{#each Object.entries(RESOURCES) as [name, r] (name)}
		<a href="/admin/{name}" class="price card font-display font-bold text-forest">{r.label}</a>
	{/each}
</div>
