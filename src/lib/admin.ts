// What the back-office can edit. Shared by server (validation) and browser (forms).
// To make another table editable, add an entry here; the admin pages and remote functions are generic.
import { PRACTICE_TYPES } from './content.ts';

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'datetime' | 'url' | 'select' | 'list';
export type Field = {
	name: string;
	label: string;
	type: FieldType;
	required?: boolean;
	/** Empty input is stored as null instead of ''. */
	nullable?: boolean;
	options?: readonly string[];
	hint?: string;
};
export type Resource = {
	label: string;
	/** Primary key column. If it is not in `fields`, the database generates it. */
	key: string;
	/** Columns shown in the list. */
	columns: string[];
	order: { column: string; ascending: boolean }[];
	/** Rows whose timestamp in this column lies ahead are listed apart, above the rest. */
	upcoming?: { column: string; label: string; restLabel: string; restColumnLabel?: string };
	/** Edited inside the parent's list (expandable rows) instead of a section of its own. Needs a `position` field. */
	parent?: { table: string; column: string };
	fields: Field[];
};

const VIDEO: Field[] = [
	{ name: 'video_provider', label: 'Video provider', type: 'select', options: ['youtube'], required: true },
	{ name: 'video_id', label: 'Video id', type: 'text', nullable: true, hint: 'YouTube: the part after "watch?v=". Empty shows "Video coming soon".' }
];

export const RESOURCES: Record<string, Resource> = {
	practices: {
		label: 'Weekly practices',
		key: 'id',
		columns: ['week', 'type', 'title', 'teacher', 'starts_at'],
		upcoming: { column: 'starts_at', label: 'Planned live', restLabel: 'Library', restColumnLabel: 'Recorded at' },
		order: [
			{ column: 'week', ascending: false },
			{ column: 'published_on', ascending: false }
		],
		fields: [
			{ name: 'week', label: 'Week', type: 'number', required: true },
			{ name: 'type', label: 'Type', type: 'select', options: PRACTICE_TYPES, required: true },
			{ name: 'title', label: 'Title', type: 'text', required: true },
			{ name: 'teacher', label: 'Teacher', type: 'text', required: true },
			{ name: 'minutes', label: 'Minutes', type: 'number', required: true },
			{ name: 'published_on', label: 'Published on', type: 'date', required: true },
			{ name: 'starts_at', label: 'Live at (Lisbon time)', type: 'datetime', nullable: true, hint: 'For a live stream: until then members see it as planned, afterwards it is the recording. Empty for an uploaded video.' },
			{ name: 'description', label: 'Description', type: 'textarea' },
			...VIDEO.map((f) => (f.name === 'video_id' ? { ...f, hint: 'YouTube: the part after "watch?v=". For a live stream, the id of the scheduled stream; it stays the recording.' } : f))
		]
	},
	courses: {
		label: 'Courses',
		key: 'slug',
		columns: ['position', 'title', 'creator', 'level'],
		order: [{ column: 'position', ascending: true }],
		fields: [
			{ name: 'slug', label: 'Slug', type: 'text', required: true, hint: 'Part of the URL, e.g. "permaculture". Cannot change later.' },
			{ name: 'title', label: 'Title', type: 'text', required: true },
			{ name: 'blurb', label: 'Blurb', type: 'textarea' },
			{ name: 'level', label: 'Level', type: 'text', required: true },
			{ name: 'duration', label: 'Duration', type: 'text', required: true, hint: 'e.g. "3 h 20"' },
			{ name: 'creator', label: 'Creator', type: 'text', nullable: true },
			{ name: 'creator_url', label: 'Full course on creator site', type: 'url', nullable: true },
			{ name: 'colors', label: 'Colours', type: 'list', required: true, hint: 'Two hex colours, comma separated, e.g. "#3A4B39, #9db280"' },
			{ name: 'position', label: 'Position', type: 'number', required: true }
		]
	},
	lessons: {
		label: 'Lessons',
		key: 'id',
		parent: { table: 'courses', column: 'course_slug' },
		columns: ['position', 'title', 'video_id'],
		order: [
			{ column: 'course_slug', ascending: true },
			{ column: 'position', ascending: true }
		],
		fields: [
			{ name: 'course_slug', label: 'Course slug', type: 'text', required: true },
			{ name: 'position', label: 'Position', type: 'number', required: true },
			{ name: 'title', label: 'Title', type: 'text', required: true },
			{ name: 'body', label: 'Text', type: 'textarea' },
			...VIDEO
		]
	},
	recordings: {
		label: 'Forum recordings',
		key: 'slug',
		columns: ['recorded_on', 'title', 'minutes'],
		order: [{ column: 'recorded_on', ascending: false }],
		fields: [
			{ name: 'slug', label: 'Slug', type: 'text', required: true, hint: 'Part of the URL. Cannot change later.' },
			{ name: 'title', label: 'Title', type: 'text', required: true },
			{ name: 'recorded_on', label: 'Recorded on', type: 'date', required: true },
			{ name: 'minutes', label: 'Minutes', type: 'number', required: true },
			{ name: 'description', label: 'Description', type: 'textarea' },
			...VIDEO
		]
	},
	moon_themes: {
		label: 'New moon meetings',
		key: 'circle_on',
		columns: ['circle_on', 'theme', 'starts_at'],
		order: [{ column: 'circle_on', ascending: false }],
		upcoming: { column: 'circle_on', label: 'Planned', restLabel: 'Past' },
		fields: [
			{ name: 'circle_on', label: 'New moon date', type: 'date', required: true, hint: 'Must match a new moon date shown on the community page.' },
			{ name: 'theme', label: 'Theme', type: 'text', required: true },
			{ name: 'invitation', label: 'Invitation', type: 'textarea' },
			{ name: 'starts_at', label: 'Meeting starts at (Lisbon time)', type: 'datetime', nullable: true, hint: 'Empty shows 19:00 on the new moon day.' },
			{ name: 'join_url', label: 'Meeting link', type: 'url', nullable: true, hint: 'Zoom/Jitsi link for the meeting.' },
			...VIDEO.map((f) => (f.name === 'video_id' ? { ...f, hint: 'Optional recording of the meeting. Once set, it shows on the community page.' } : f))
		]
	}
};

/** The resource listed inside each row of `table`, if any. */
export const childOf = (table: string) => Object.entries(RESOURCES).find(([, r]) => r.parent?.table === table);

const TZ = 'Europe/Lisbon';

/** How far Lisbon is ahead of UTC at that moment, in ms. */
function lisbonOffset(date: Date) {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: TZ,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).formatToParts(date);
	const p = Object.fromEntries(parts.map((x) => [x.type, Number(x.value)]));
	return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(date.getTime() / 60e3) * 60e3;
}

/** "2026-11-30T08:00" in Lisbon time → ISO timestamp. */
export function lisbonToIso(local: string) {
	const asUtc = new Date(`${local}:00Z`);
	return new Date(asUtc.getTime() - lisbonOffset(asUtc)).toISOString();
}

/** ISO timestamp → "2026-11-30T08:00" in Lisbon time, for `<input type="datetime-local">`. */
export function isoToLisbon(iso: string) {
	const date = new Date(iso);
	return new Date(date.getTime() + lisbonOffset(date)).toISOString().slice(0, 16);
}

/** Form value for a stored column value. */
export function toInput(field: Field, value: unknown): string {
	if (value == null) return '';
	if (field.type === 'datetime') return isoToLisbon(String(value));
	if (field.type === 'list') return (value as string[]).join(', ');
	return String(value);
}

const parsers: Record<FieldType, (raw: string, field: Field) => unknown> = {
	text: (s) => (s.length <= 300 ? s : undefined),
	textarea: (s) => (s.length <= 20000 ? s : undefined),
	number: (s) => (/^-?\d{1,9}$/.test(s) ? Number(s) : undefined),
	date: (s) => (/^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)) ? s : undefined),
	datetime: (s) => (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s) && !isNaN(Date.parse(`${s}:00Z`)) ? lisbonToIso(s) : undefined),
	url: (s) => (URL.canParse(s) && /^https?:$/.test(new URL(s).protocol) ? s : undefined),
	select: (s, f) => (f.options?.includes(s) ? s : undefined),
	list: (s) => s.split(',').map((x) => x.trim()).filter(Boolean)
};

const problems: Record<FieldType, string> = {
	text: 'is too long',
	textarea: 'is too long',
	number: 'must be a whole number',
	date: 'must be a date',
	datetime: 'must be a date and time',
	url: 'must be a link starting with https://',
	select: 'is not one of the options',
	list: 'is not valid'
};

/** Turns submitted form values into a database row, or field issues. */
export function parseRow(resource: Resource, input: Record<string, unknown>) {
	const row: Record<string, unknown> = {};
	const issues: { message: string; path: [string] }[] = [];
	for (const field of resource.fields) {
		const raw = typeof input[field.name] === 'string' ? (input[field.name] as string).trim() : '';
		if (!raw) {
			if (field.required) issues.push({ message: `${field.label} is required`, path: [field.name] });
			else row[field.name] = field.nullable ? null : '';
			continue;
		}
		const value = parsers[field.type](raw, field);
		if (value === undefined) issues.push({ message: `${field.label} ${problems[field.type]}`, path: [field.name] });
		else row[field.name] = value;
	}
	return { row, issues };
}
