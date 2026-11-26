<script lang="ts">
	import { deletePost } from '#lib/remote/admin.remote.ts';
	import { getThreads } from '#lib/remote/community.remote.ts';
	import { SvelteSet } from 'svelte/reactivity';

	const threads = $derived(await getThreads());
	const open = new SvelteSet<string>();
	const date = (iso: string) => iso.slice(0, 16).replace('T', ' ');

	async function remove(kind: 'threads' | 'replies', id: string, what: string) {
		if (confirm(`Delete ${what}? This cannot be undone.`)) await deletePost({ kind, id });
	}
</script>

<h1 class="display mb-6 text-3xl">Exchange</h1>

{#each threads as t (t.id)}
	<div class="border-b border-white/8 py-3 text-[0.85rem]">
		<div class="flex items-start gap-2">
			<button
				class="min-w-0 flex-1 text-left"
				aria-expanded={open.has(t.id)}
				onclick={() => (open.has(t.id) ? open.delete(t.id) : open.add(t.id))}
			>
				<span class="mr-1 inline-block transition-transform {open.has(t.id) ? 'rotate-90' : ''}" aria-hidden="true">▸</span>
				<span class="font-display">{t.title}</span>
				<span class="muted block pl-4">{t.author_name} · {date(t.created_at)} · {t.replies.length} {t.replies.length === 1 ? 'reply' : 'replies'}</span>
			</button>
			<button class="shrink-0 text-glow underline" onclick={() => remove('threads', t.id, `the post “${t.title}”${t.replies.length ? ` and its ${t.replies.length} replies` : ''}`)}>Delete</button>
		</div>
		{#if open.has(t.id)}
			<div class="glass mt-3 p-3!">
				<p class="mb-3 whitespace-pre-line break-words"><span class="chip mr-2">{t.category}</span>{t.body}</p>
				{#each t.replies as reply (reply.id)}
					<div class="flex gap-3 border-t border-white/8 py-1.5">
						<p class="min-w-0 flex-1 whitespace-pre-line break-words"><span class="muted">{reply.author_name}, {date(reply.created_at)}:</span> {reply.body}</p>
						<button class="shrink-0 self-start text-glow underline" onclick={() => remove('replies', reply.id, `this reply by ${reply.author_name}`)}>Delete</button>
					</div>
				{:else}
					<p class="muted">No replies yet.</p>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<p class="muted">No posts yet.</p>
{/each}
