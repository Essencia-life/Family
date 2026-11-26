<script lang="ts">
	let { children } = $props();
</script>

<svelte:head><title>Log in · Essência Family</title></svelte:head>

<!-- Shared frame for the login, "check your email" and error pages. -->
<div class="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden px-4 py-16">
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 50% 40% at 50% 60%, rgba(240, 170, 80, 0.22), transparent 70%)"></div>
	<div class="glass relative w-full max-w-md p-8! text-center backdrop-blur-md">
		<span class="orb mx-auto mb-5 block h-12 w-12 rounded-full shadow-[0_0_40px_10px_rgba(232,180,85,0.3)]"></span>
		{@render children()}
	</div>
</div>
