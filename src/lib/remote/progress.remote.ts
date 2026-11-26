import { error } from '@sveltejs/kit';
import { command, query } from '$app/server';
import * as v from 'valibot';
import { db, must } from '#lib/server/db.ts';
import { requireMember } from '#lib/server/guard.ts';
import { rhythm } from '#lib/rhythm.ts';
import { getCourse, getCourses, getLibrary, getPractice, getPractices } from './content.remote.ts';

/** The member's practice rhythm: last 7 days and mornings this month. */
export const getRhythm = query(async () => {
	const member = await requireMember();
	const since = new Date(Date.now() - 32 * 864e5).toISOString();
	const rows = must(await db.from('practised').select('practised_at').eq('user_id', member.id).gte('practised_at', since));
	return rhythm(rows.map((r) => r.practised_at));
});

export const setPractised = command(
	v.object({ id: v.pipe(v.string(), v.uuid()), done: v.boolean() }),
	async ({ id, done }) => {
		const member = await requireMember();
		const row = { user_id: member.id, practice_id: id };
		must(
			done
				? await db.from('practised').upsert(row, { ignoreDuplicates: true })
				: await db.from('practised').delete().match(row)
		);
		await getPractices().refresh();
		await getLibrary().refresh();
		await getPractice(id).refresh();
		await getRhythm().refresh();
	}
);

export const setLessonDone = command(
	v.object({ slug: v.string(), lessonId: v.pipe(v.string(), v.uuid()), done: v.boolean() }),
	async ({ slug, lessonId, done }) => {
		const member = await requireMember();
		const lesson = must(
			await db.from('lessons').select('id').eq('id', lessonId).eq('course_slug', slug).maybeSingle()
		);
		if (!lesson) error(404, 'Lesson not found');
		const row = { user_id: member.id, lesson_id: lessonId };
		must(
			done
				? await db.from('lesson_progress').upsert(row, { ignoreDuplicates: true })
				: await db.from('lesson_progress').delete().match(row)
		);
		await getCourse(slug).refresh();
		await getCourses().refresh();
	}
);
