<script lang="ts">
	import { page } from '$app/state';
	import { childOf, RESOURCES, toInput } from '#lib/admin.ts';
	import { deleteRow, listRows } from '#lib/remote/admin.remote.ts';
	import { SvelteSet } from 'svelte/reactivity';
	import Children from './Children.svelte';

	const table = $derived(page.params.table!);
	const r = $derived(RESOURCES[table]);
	const all = $derived(await listRows(table));
	const child = $derived(childOf(table));
	const open = new SvelteSet<string>();
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

{#snippet list(rows: typeof all, labels: Record<string, string> = {})}
	<div class="overflow-x-auto">
		<table class="w-full text-left text-[0.85rem]">
			<thead>
				<tr class="border-b border-white/15">
					{#if child}<th class="w-8"></th>{/if}
					{#each r.columns as column (column)}<th class="py-2 pr-4 font-display">{labels[column] ?? r.fields.find((f) => f.name === column)?.label ?? column}</th>{/each}
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each rows as { key, row } (key)}
					<tr class="border-b border-white/8">
						{#if child}
							<td class="py-2">
								<button
									class="px-1 transition-transform {open.has(key) ? 'rotate-90' : ''}"
									aria-expanded={open.has(key)}
									aria-label="{open.has(key) ? 'Hide' : 'Show'} {child[1].label.toLowerCase()}"
									onclick={() => (open.has(key) ? open.delete(key) : open.add(key))}>▸</button
								>
							</td>
						{/if}
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
					{#if child && open.has(key)}
						<tr class="border-b border-white/8">
							<td></td>
							<td colspan={r.columns.length + 1} class="pb-4"><Children table={child[0]} parent={key} /></td>
						</tr>
					{/if}
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
	{@render list(all.filter((x) => !ahead.includes(x)), r.upcoming.restColumnLabel ? { [col]: r.upcoming.restColumnLabel } : {})}
{:else if all.length}
	{@render list(all)}
{:else}
	<p class="muted">Nothing here yet.</p>
{/if}
