<script lang="ts">
	import CourseCard from '#lib/components/CourseCard.svelte';
	import { getCourses } from '#lib/remote/content.remote.ts';

	const courses = $derived(await getCourses());
</script>

<div class="px-6 py-10">
	<div class="container">
		<p class="eyebrow mb-1">Courses</p>
		<h1 class="h2 mb-2 text-3xl">Learn to live lightly.</h1>
		<p class="mb-8 text-[0.92rem] opacity-70">Work through at your own pace. We remember where you stopped.</p>
		<div class="grid gap-5 md:grid-cols-2">
			{#each courses as course (course.slug)}<CourseCard {course} />{/each}
		</div>
	</div>
</div>
