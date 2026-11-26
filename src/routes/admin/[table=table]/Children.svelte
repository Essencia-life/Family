<script lang="ts">
	import { RESOURCES, toInput } from '#lib/admin.ts';
	import { deleteRow, listRows, moveRow } from '#lib/remote/admin.remote.ts';

	let { table, parent }: { table: string; parent: string } = $props();

	const r = $derived(RESOURCES[table]);
	const rows = $derived((await listRows(table)).filter(({ row }) => String(row[r.parent!.column]) === parent));
	const next = $derived(Math.max(0, ...rows.map(({ row }) => Number(row.position))) + 1);
	const cell = (column: string, value: unknown) => {
		const field = r.fields.find((f) => f.name === column);
		return field ? toInput(field, value) : String(value ?? '');
	};

	async function remove(key: string) {
		if (confirm('Delete this entry? Members lose it and their progress on it.')) await deleteRow({ table, key });
	}
</script>

<div class="glass p-3!">
	{#if rows.length}
		<table class="w-full text-left">
			<tbody>
				{#each rows as { key, row }, i (key)}
					<tr class="border-b border-white/8 last:border-0">
						{#each r.columns.filter((c) => c !== 'position') as column (column)}
							<td class="py-1.5 pr-4">
								{#if column === 'title'}
									<a href="/admin/{table}/{encodeURIComponent(key)}" class="text-stone underline">{i + 1}. {cell(column, row[column]) || '(empty)'}</a>
								{:else}
									<span class="muted max-sm:hidden">{cell(column, row[column])}</span>
								{/if}
							</td>
						{/each}
						<td class="py-1.5 text-right whitespace-nowrap">
							<button class="px-1 disabled:opacity-30" aria-label="Move up" disabled={i === 0} onclick={() => moveRow({ table, key, by: -1 })}>↑</button>
							<button class="px-1 disabled:opacity-30" aria-label="Move down" disabled={i === rows.length - 1} onclick={() => moveRow({ table, key, by: 1 })}>↓</button>
							<button class="ml-2 text-glow underline" onclick={() => remove(key)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="muted">No {r.label.toLowerCase()} yet.</p>
	{/if}
	<a href="/admin/{table}/new?{r.parent!.column}={encodeURIComponent(parent)}&position={next}" class="btn btn-ghost btn-sm mt-3">Add {r.label.toLowerCase().replace(/s$/, '')}</a>
</div>
