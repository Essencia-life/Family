import { error, invalid, redirect } from '@sveltejs/kit';
import { command, form, query } from '$app/server';
import * as v from 'valibot';
import { parseRow, RESOURCES } from '#lib/admin.ts';
import { db, must } from '#lib/server/db.ts';
import { requireMaintainer } from '#lib/server/guard.ts';

const table = v.picklist(Object.keys(RESOURCES));
const ref = v.object({ table, key: v.pipe(v.string(), v.nonEmpty()) });

export const listRows = query(table, async (name) => {
	await requireMaintainer();
	const r = RESOURCES[name];
	let q = db.from(name).select([r.key, ...r.columns].join(', '));
	for (const o of r.order) q = q.order(o.column, { ascending: o.ascending });
	// The key travels with each row: while the next table loads, the page still shows the old rows.
	return (must(await q) as unknown as Record<string, unknown>[]).map((row) => ({ key: String(row[r.key]), row }));
});

export const getRow = query(ref, async ({ table, key }) => {
	await requireMaintainer();
	const row = must(await db.from(table).select('*').eq(RESOURCES[table].key, key).maybeSingle());
	if (!row) error(404, 'Not found');
	return row as Record<string, unknown>;
});

/** Creates a row, or updates the one named by `_key`. The key itself never changes (other tables point to it). */
export const saveRow = form('unchecked', async (input: Record<string, unknown>) => {
	await requireMaintainer();
	const name = v.parse(table, input._table);
	const r = RESOURCES[name];
	const { row, issues } = parseRow(r, input);
	if (issues.length) invalid(...issues);

	const original = typeof input._key === 'string' ? input._key : '';
	if (original) delete row[r.key];
	const { error: e } = original
		? await db.from(name).update(row).eq(r.key, original)
		: await db.from(name).insert(row);
	if (e?.code === '23505') invalid('An entry with this key already exists');
	if (e?.code === '23503') invalid('This points to something that does not exist (check the course slug)');
	if (e) throw e;
	redirect(303, `/admin/${name}`);
});

export const deleteRow = command(ref, async ({ table, key }) => {
	await requireMaintainer();
	must(await db.from(table).delete().eq(RESOURCES[table].key, key));
	await listRows(table).refresh();
});
