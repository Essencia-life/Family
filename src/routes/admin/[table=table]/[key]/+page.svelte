<script lang="ts">
	import { page } from '$app/state';
	import { RESOURCES, toInput, type Field } from '#lib/admin.ts';
	import { getRow, saveRow } from '#lib/remote/admin.remote.ts';

	const table = $derived(page.params.table!);
	const key = $derived(page.params.key === 'new' ? '' : page.params.key!);
	const r = $derived(RESOURCES[table]);
	const row = $derived(key ? await getRow({ table, key }) : {});
	const types = { text: 'text', textarea: 'text', number: 'number', date: 'date', datetime: 'datetime-local', url: 'url', select: 'text', list: 'text' };
	const attrs = (f: Field) => saveRow.fields[f.name].as('text', toInput(f, row[f.name]) || (f.options?.[0] ?? ''));
</script>

<a href="/admin/{table}" class="text-[0.85rem] underline opacity-70">← {r.label}</a>
<h1 class="h2 mt-2 mb-6 text-3xl">{key ? 'Edit' : 'New'}</h1>

<form class="price grid max-w-2xl gap-4 text-[0.85rem]" {...saveRow}>
	<input {...saveRow.fields._table.as('hidden', table)} />
	<input {...saveRow.fields._key.as('hidden', key)} />
	{#each r.fields as f (f.name)}
		<label class="flex flex-col gap-1">
			<span>{f.label}{f.required ? ' *' : ''}</span>
			{#if f.type === 'textarea'}
				<textarea class="field min-h-32" {...attrs(f)}></textarea>
			{:else if f.type === 'select'}
				<select class="field" {...attrs(f)}>
					{#each f.options ?? [] as option (option)}<option>{option}</option>{/each}
				</select>
			{:else}
				<!-- The primary key stays fixed once created: other tables point to it. -->
				<input class="field" {...attrs(f)} type={types[f.type]} readonly={!!key && f.name === r.key} />
			{/if}
			{#if f.hint}<span class="opacity-60">{f.hint}</span>{/if}
			{#each saveRow.fields[f.name].issues() ?? [] as issue (issue.message)}<span class="issue">{issue.message}</span>{/each}
		</label>
	{/each}
	{#each saveRow.fields.issues() ?? [] as issue (issue.message)}<p class="issue">{issue.message}</p>{/each}
	<div><button class="pill-btn bg-forest text-stone" disabled={saveRow.pending > 0}>Save</button></div>
</form>
