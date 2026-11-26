import { defineParams } from '@sveltejs/kit/params';
import { RESOURCES } from '#lib/admin.ts';

export const params = defineParams({
	table: (param) => (Object.hasOwn(RESOURCES, param) ? param : undefined)
});
