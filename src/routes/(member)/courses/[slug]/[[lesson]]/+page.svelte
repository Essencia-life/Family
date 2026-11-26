<script lang="ts">
	import { page } from '$app/state';
	import { COURSE_SVG, percent } from '#lib/content.ts';
	import Player from '#lib/components/Player.svelte';
	import { getCourse } from '#lib/remote/content.remote.ts';
	import { setLessonDone } from '#lib/remote/progress.remote.ts';

	const course = $derived(await getCourse(page.params.slug!));
	// Without a lesson in the URL, open where the member stopped: the first lesson not yet done.
	const index = $derived(
		page.params.lesson
			? Math.min(Math.max(Number(page.params.lesson) - 1 || 0, 0), course.lessons.length - 1)
			: Math.max(course.lessons.findIndex((l) => !l.done), 0)
	);
	const lesson = $derived(course.lessons[index]);
	const pct = $derived(percent(course.lessons.filter((l) => l.done).length, course.lessons.length));
</script>

<div class="py-8">
	<div class="wrap">
		<a href="/courses" class="link">&larr; All courses</a>
		<div class="mt-5 grid gap-8 md:grid-cols-[1fr_310px]">
			<div>
				{#if lesson}
					<Player video={lesson} title={lesson.title} colors={course.colors} svg={COURSE_SVG} />
					<p class="eyebrow mt-9 mb-2">{course.title}</p>
					<h1 class="display mb-3 text-3xl">Lesson {index + 1}: {lesson.title}</h1>
					<p class="muted mb-6 leading-[1.8]">{lesson.body}</p>
					<button
						class="btn btn-amber"
						disabled={setLessonDone.pending > 0}
						onclick={() => setLessonDone({ slug: course.slug, lessonId: lesson.id, done: !lesson.done })}
					>
						{lesson.done ? '✓ Completed' : 'Mark lesson complete'}
					</button>
				{:else}
					<h1 class="display text-3xl">{course.title}</h1>
					<p class="muted mt-3">Lessons are on their way.</p>
				{/if}
			</div>
			<aside class="flex flex-col gap-4 self-start">
			<div class="glass p-3!">
				<p class="display px-3 pt-2 pb-2 text-lg">{course.lessons.length} lessons · {course.duration}</p>
				<div class="track mx-3 mb-3"><div class="fill" style="width:{pct}%"></div></div>
				{#each course.lessons as l, i (l.id)}
					<a href="/courses/{course.slug}/{i + 1}" class="lesson" aria-current={i === index ? 'page' : undefined}>
						<span class="tick" class:done={l.done}>✓</span><span>{i + 1}. {l.title}</span>
					</a>
				{/each}
			</div>
			{#if course.creator_url}
				<div class="glass glow">
					<p class="display text-xl">Want to go deeper?</p>
					<p class="muted mt-1 mb-4 text-[0.85rem]">
						{course.creator ?? 'The creator'} offers the full course on their own website.
					</p>
					<a href={course.creator_url} class="btn btn-amber btn-sm" target="_blank" rel="noopener">Full course &nearr;</a>
				</div>
			{/if}
			</aside>
		</div>
	</div>
</div>
