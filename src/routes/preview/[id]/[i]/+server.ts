import { error } from '@sveltejs/kit';
import { db, must } from '#lib/server/db.ts';
import { thumbnails } from '#lib/video.ts';
import type { RequestHandler } from './$types';

/** A practice thumbnail for the public landing page, so visitors never see the members' video ids. */
export const GET: RequestHandler = async ({ params, fetch }) => {
	if (!/^[0-9a-f-]{36}$/i.test(params.id)) error(404);
	const row = must(await db.from('practices').select('video_provider, video_id').eq('id', params.id).maybeSingle());
	const thumb = thumbnails(row)[Number(params.i)];
	if (!thumb) error(404);
	const res = await fetch(thumb.url).catch(() => null);
	if (!res?.ok) error(404);
	return new Response(res.body, {
		headers: { 'content-type': res.headers.get('content-type') ?? 'image/jpeg', 'cache-control': 'public, max-age=86400' }
	});
};
