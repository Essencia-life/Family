<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const email = $derived(data.providers.includes('resend'));
	const google = $derived(data.providers.includes('google'));
</script>

<p class="eyebrow mb-2">Welcome home</p>
<h1 class="display mb-3 text-3xl">Log in to <span class="accent">the Family.</span></h1>
<p class="muted mb-7 text-[0.88rem]">We send you a link by email, no password needed.</p>

{#if data.error}
	<p class="issue mb-5">Logging in didn't work. Please try again.</p>
{/if}

{#if email}
	<form method="POST" class="flex flex-col gap-3 text-left">
		<input type="hidden" name="providerId" value="resend" />
		<input type="hidden" name="redirectTo" value={data.next} />
		<label class="flex flex-col gap-1 text-[0.85rem]">
			Email
			<input class="field" type="email" name="email" required autocomplete="email" placeholder="you@example.com" />
		</label>
		<button class="btn btn-amber justify-center">Send me a login link</button>
	</form>
{/if}

{#if email && google}
	<p class="muted my-5 flex items-center gap-3 text-[0.75rem] tracking-[0.2em] uppercase before:h-px before:flex-1 before:bg-ink/15 after:h-px after:flex-1 after:bg-ink/15">or</p>
{/if}

{#if google}
	<form method="POST">
		<input type="hidden" name="providerId" value="google" />
		<input type="hidden" name="redirectTo" value={data.next} />
		<button class="btn btn-ghost w-full justify-center">Continue with Google</button>
	</form>
{/if}

{#if !email && !google}
	<p class="issue">No login method is configured yet.</p>
{/if}
