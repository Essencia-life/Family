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
	const columns = [r.key, ...r.columns, ...(r.parent ? [r.parent.column] : [])];
	let q = db.from(name).select(columns.join(', '));
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
	redirect(303, `/admin/${r.parent?.table ?? name}`);
});

export const deleteRow = command(ref, async ({ table, key }) => {
	await requireMaintainer();
	must(await db.from(table).delete().eq(RESOURCES[table].key, key));
	await listRows(table).refresh();
});

/** Moves a child row (e.g. a lesson) one place up or down among its siblings, renumbering them 1..n. */
export const moveRow = command(v.object({ ...ref.entries, by: v.picklist([-1, 1]) }), async ({ table, key, by }) => {
	await requireMaintainer();
	const r = RESOURCES[table];
	if (!r.parent) error(400, 'Only nested entries can be moved');
	const row = must(await db.from(table).select(r.parent.column).eq(r.key, key).single()) as unknown as Record<string, unknown>;
	const siblings = must(
		await db.from(table).select(`${r.key}, position`).eq(r.parent.column, row[r.parent.column]).order('position').order(r.key)
	) as unknown as Record<string, unknown>[];
	const keys = siblings.map((s) => String(s[r.key]));
	const i = keys.indexOf(key);
	const j = i + by;
	if (j < 0 || j >= keys.length) return;
	[keys[i], keys[j]] = [keys[j], keys[i]];
	const position = new Map(siblings.map((s) => [String(s[r.key]), s.position]));
	const changed = keys.filter((k, n) => position.get(k) !== n + 1);
	// (parent, position) is unique: park the moved rows on negative positions first.
	for (const sign of [-1, 1]) {
		const updates = changed.map((k) => db.from(table).update({ position: sign * (keys.indexOf(k) + 1) }).eq(r.key, k));
		for (const result of await Promise.all(updates)) must(result);
	}
	await listRows(table).refresh();
});
