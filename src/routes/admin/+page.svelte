<script lang="ts">
	import { RESOURCES } from '#lib/admin.ts';
</script>

<h1 class="display mb-2 text-3xl">Back-office</h1>
<p class="mb-8 muted">Edit what members see. Changes are live right away.</p>
<div class="grid gap-3 sm:grid-cols-2">
	{#each Object.entries(RESOURCES).filter(([, r]) => !r.parent) as [name, r] (name)}
		<a href="/admin/{name}" class="glass card display text-xl">{r.label}</a>
	{/each}
</div>
