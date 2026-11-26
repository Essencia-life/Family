import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import * as v from 'valibot';
import { db, must } from '#lib/server/db.ts';
import { requireMember } from '#lib/server/guard.ts';

const PRACTICE = 'week, type, title, teacher, minutes, description, video_provider, video_id';

/** Public teaser for the landing page: no videos, no descriptions. */
export const getPreview = query(async () => {
	const [practices, courses] = await Promise.all([
		db.from('practices').select('week, type, title, teacher, minutes').order('week', { ascending: false }).limit(6),
		db.from('courses').select('slug, title, duration, colors, creator, lessons(count)').order('position')
	]);
	return {
		practices: must(practices),
		courses: must(courses).map(({ lessons, ...c }) => ({ ...c, lessonCount: lessons[0]?.count ?? 0 }))
	};
});

export const getPractices = query(async () => {
	const member = await requireMember();
	const [practices, practised] = await Promise.all([
		db.from('practices').select(PRACTICE).order('week', { ascending: false }),
		db.from('practised').select('week').eq('user_id', member.id)
	]);
	const done = new Set(must(practised).map((p) => p.week));
	return must(practices).map((p) => ({ ...p, practised: done.has(p.week) }));
});

export const getPractice = query(v.pipe(v.number(), v.integer()), async (week) => {
	const all = await getPractices();
	const i = all.findIndex((p) => p.week === week);
	if (i < 0) error(404, 'Practice not found');
	return { practice: all[i], newer: all[i - 1] ?? null, older: all[i + 1] ?? null };
});

export const getCourses = query(async () => {
	const member = await requireMember();
	const [courses, progress] = await Promise.all([
		db.from('courses').select('slug, title, blurb, level, duration, colors, creator, lessons(id)').order('position'),
		db.from('lesson_progress').select('lesson_id').eq('user_id', member.id)
	]);
	const done = new Set(must(progress).map((p) => p.lesson_id));
	return must(courses).map(({ lessons, ...c }) => ({
		...c,
		lessonCount: lessons.length,
		doneCount: lessons.filter((l) => done.has(l.id)).length
	}));
});

export const getCourse = query(v.string(), async (slug) => {
	const member = await requireMember();
	const course = must(
		await db
			.from('courses')
			.select('slug, title, blurb, level, duration, colors, creator, creator_url, lessons(id, position, title, body, video_provider, video_id)')
			.eq('slug', slug)
			.order('position', { referencedTable: 'lessons' })
			.maybeSingle()
	);
	if (!course) error(404, 'Course not found');
	const progress = must(
		await db
			.from('lesson_progress')
			.select('lesson_id')
			.eq('user_id', member.id)
			.in('lesson_id', course.lessons.map((l) => l.id))
	);
	const done = new Set(progress.map((p) => p.lesson_id));
	return { ...course, lessons: course.lessons.map((l) => ({ ...l, done: done.has(l.id) })) };
});

export const getRecordings = query(async () => {
	await requireMember();
	return must(
		await db
			.from('recordings')
			.select('slug, title, recorded_on, minutes, description, video_provider, video_id')
			.order('recorded_on', { ascending: false })
	);
});

export const getRecording = query(v.string(), async (slug) => {
	const recording = (await getRecordings()).find((r) => r.slug === slug);
	if (!recording) error(404, 'Recording not found');
	return recording;
});
