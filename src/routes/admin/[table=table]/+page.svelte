<script lang="ts">
	import { page } from '$app/state';
	import { RESOURCES, toInput } from '#lib/admin.ts';
	import { deleteRow, listRows } from '#lib/remote/admin.remote.ts';

	const table = $derived(page.params.table!);
	const r = $derived(RESOURCES[table]);
	const all = $derived(await listRows(table));
	const cell = (column: string, value: unknown) => {
		const field = r.fields.find((f) => f.name === column);
		return field ? toInput(field, value).replace('T', ' ') : String(value ?? '');
	};

	async function remove(key: string) {
		if (confirm('Delete this entry? Members lose it and their progress on it.')) await deleteRow({ table, key });
	}
</script>

<div class="mb-6 flex items-center justify-between gap-4">
	<h1 class="display text-3xl">{r.label}</h1>
	<a href="/admin/{table}/new" class="btn btn-amber btn-sm">New</a>
</div>

{#snippet list(rows: typeof all)}
	<div class="overflow-x-auto">
		<table class="w-full text-left text-[0.85rem]">
			<thead>
				<tr class="border-b border-white/15">
					{#each r.columns as column (column)}<th class="py-2 pr-4 font-display">{r.fields.find((f) => f.name === column)?.label ?? column}</th>{/each}
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each rows as { key, row } (key)}
					<tr class="border-b border-white/8">
						{#each r.columns as column (column)}
							<td class="py-2 pr-4">
								{#if column === r.columns[0] || column === 'title'}
									<a href="/admin/{table}/{encodeURIComponent(key)}" class="text-stone underline">{cell(column, row[column]) || '(empty)'}</a>
								{:else}
									{cell(column, row[column])}
								{/if}
							</td>
						{/each}
						<td class="py-2 text-right"><button class="text-glow underline" onclick={() => remove(key)}>Delete</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

{#if r.upcoming}
	{@const col = r.upcoming.column}
	{@const ahead = all.filter(({ row }) => row[col] && Date.parse(String(row[col])) > Date.now())}
	<h2 class="display mb-3 text-xl">{r.upcoming.label}</h2>
	{#if ahead.length}{@render list(ahead.toSorted((a, b) => Date.parse(String(a.row[col])) - Date.parse(String(b.row[col]))))}{:else}<p class="muted">Nothing planned.</p>{/if}
	<h2 class="display mt-10 mb-3 text-xl">{r.upcoming.restLabel}</h2>
	{@render list(all.filter((x) => !ahead.includes(x)))}
{:else if all.length}
	{@render list(all)}
{:else}
	<p class="muted">Nothing here yet.</p>
{/if}
