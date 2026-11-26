<script lang="ts">
	import { page } from '$app/state';

	// Error codes from Auth.js: https://authjs.dev/guides/pages/error
	const messages: Record<string, string> = {
		Verification: 'This login link has expired or was already used. Links work once and for a short time.',
		AccessDenied: "You don't have access with this account.",
		Configuration: 'Something is wrong on our side. Please try again later.'
	};
	const message = $derived(messages[page.url.searchParams.get('error') ?? ''] ?? 'Something went wrong while logging in.');
</script>

<p class="eyebrow mb-2">Hmm</p>
<h1 class="display mb-3 text-3xl">That didn't <span class="accent">work.</span></h1>
<p class="muted mb-7 text-[0.88rem]">{message}</p>
<a href="/login" class="btn btn-amber">Try again</a>
