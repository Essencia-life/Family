<script lang="ts">
	import CourseCard from '#lib/components/CourseCard.svelte';
	import { getCourses } from '#lib/remote/content.remote.ts';

	const courses = $derived(await getCourses());
</script>

<div class="py-10">
	<div class="wrap">
		<p class="eyebrow mb-2">Intro classes</p>
		<h1 class="display mb-3 text-4xl md:text-5xl">Learn from <span class="accent">our creators.</span></h1>
		<p class="muted mb-9 max-w-2xl">
			Short intro classes, at your own pace. We remember where you stopped. If you want to go deeper, each creator offers the full course on their own website.
		</p>
		<div class="grid gap-6 md:grid-cols-2">
			{#each courses as course (course.slug)}<CourseCard {course} />{/each}
		</div>
	</div>
</div>
