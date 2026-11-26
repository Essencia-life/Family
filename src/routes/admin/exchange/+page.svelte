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

{#if threads.length}
	<div class="overflow-x-auto">
		<table class="w-full text-left text-[0.85rem]">
			<thead>
				<tr class="border-b border-white/15">
					<th class="w-8"></th>
					<th class="py-2 pr-4 font-display">Posted</th>
					<th class="py-2 pr-4 font-display">Title</th>
					<th class="py-2 pr-4 font-display">Author</th>
					<th class="py-2 pr-4 font-display">Replies</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each threads as t (t.id)}
					<tr class="border-b border-white/8">
						<td class="py-2">
							<button
								class="px-1 transition-transform {open.has(t.id) ? 'rotate-90' : ''}"
								aria-expanded={open.has(t.id)}
								aria-label="{open.has(t.id) ? 'Hide' : 'Show'} post and replies"
								onclick={() => (open.has(t.id) ? open.delete(t.id) : open.add(t.id))}>▸</button
							>
						</td>
						<td class="py-2 pr-4 whitespace-nowrap">{date(t.created_at)}</td>
						<td class="py-2 pr-4">{t.title}</td>
						<td class="py-2 pr-4">{t.author_name}</td>
						<td class="py-2 pr-4">{t.replies.length}</td>
						<td class="py-2 text-right">
							<button class="text-glow underline" onclick={() => remove('threads', t.id, `the post “${t.title}”${t.replies.length ? ` and its ${t.replies.length} replies` : ''}`)}>Delete</button>
						</td>
					</tr>
					{#if open.has(t.id)}
						<tr class="border-b border-white/8">
							<td></td>
							<td colspan="5" class="pb-4">
								<div class="glass p-3!">
									<p class="mb-3 whitespace-pre-line"><span class="chip mr-2">{t.category}</span>{t.body}</p>
									{#each t.replies as reply (reply.id)}
										<div class="flex gap-4 border-t border-white/8 py-1.5">
											<p class="flex-1 whitespace-pre-line"><span class="muted">{reply.author_name}, {date(reply.created_at)}:</span> {reply.body}</p>
											<button class="self-start text-glow underline" onclick={() => remove('replies', reply.id, `this reply by ${reply.author_name}`)}>Delete</button>
										</div>
									{:else}
										<p class="muted">No replies yet.</p>
									{/each}
								</div>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="muted">No posts yet.</p>
{/if}
