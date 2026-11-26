<script lang="ts">
	import Landing from '#lib/components/Landing.svelte';
	import MemberHome from '#lib/components/MemberHome.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.session?.user}<MemberHome />{:else}<Landing />{/if}
