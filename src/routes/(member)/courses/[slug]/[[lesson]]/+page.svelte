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

<div class="px-6 py-8">
	<div class="container">
		<a href="/courses" class="text-[0.85rem] text-terra underline">&larr; All courses</a>
		<div class="mt-4 grid gap-8 md:grid-cols-[1fr_300px]">
			<div>
				{#if lesson}
					<Player video={lesson} title={lesson.title} colors={course.colors} svg={COURSE_SVG} />
					<p class="eyebrow mt-6 mb-1">{course.title}</p>
					<h1 class="h2 mb-3 text-2xl">Lesson {index + 1}: {lesson.title}</h1>
					<p class="mb-5 text-[0.92rem] leading-[1.8] opacity-75">{lesson.body}</p>
					<button
						class="pill-btn bg-forest text-stone"
						disabled={setLessonDone.pending > 0}
						onclick={() => setLessonDone({ slug: course.slug, lessonId: lesson.id, done: !lesson.done })}
					>
						{lesson.done ? '✓ Completed' : 'Mark lesson complete'}
					</button>
				{:else}
					<h1 class="h2 text-2xl">{course.title}</h1>
					<p class="mt-3 opacity-70">Lessons are on their way.</p>
				{/if}
			</div>
			<aside class="price self-start p-3!">
				<p class="px-2 py-2 font-display font-bold text-forest">{course.lessons.length} lessons · {course.duration}</p>
				<div class="track mx-2 mb-2"><div class="fill" style="width:{pct}%"></div></div>
				{#each course.lessons as l, i (l.id)}
					<a href="/courses/{course.slug}/{i + 1}" class="lesson" aria-current={i === index ? 'page' : undefined}>
						<span class="tick" class:done={l.done}>✓</span><span>{i + 1}. {l.title}</span>
					</a>
				{/each}
			</aside>
		</div>
	</div>
</div>
