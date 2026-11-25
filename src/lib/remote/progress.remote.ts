import { error } from '@sveltejs/kit';
import { command } from '$app/server';
import * as v from 'valibot';
import { db, must } from '#lib/server/db.ts';
import { requireMember } from '#lib/server/guard.ts';
import { getCourse, getCourses, getPractice, getPractices } from './content.remote.ts';

export const setPractised = command(
	v.object({ week: v.pipe(v.number(), v.integer()), done: v.boolean() }),
	async ({ week, done }) => {
		const member = await requireMember();
		const row = { user_id: member.id, week };
		must(
			done
				? await db.from('practised').upsert(row, { ignoreDuplicates: true })
				: await db.from('practised').delete().match(row)
		);
		await getPractices().refresh();
		await getPractice(week).refresh();
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
