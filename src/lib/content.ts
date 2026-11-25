// Look of the placeholder artwork, per practice type. Shared by server and browser.
export const PRACTICE_TYPES = ['Yoga', 'Breathwork', 'Qi Gong', 'Meditation', 'Movement'] as const;
export const THREAD_CATEGORIES = ['New moon reflections', 'Practice', 'Community life', 'Permaculture', 'Eco-village'] as const;

const forumDots = [0, 1, 2, 3, 4, 5, 6, 7]
	.map(
		(i) =>
			`<circle cx="${160 + 62 * Math.cos((i * Math.PI) / 4)}" cy="${100 + 62 * Math.sin((i * Math.PI) / 4)}" r="9" fill="rgba(252,250,244,.55)"/>`
	)
	.join('');

export const ART: Record<string, { colors: [string, string]; svg: string }> = {
	Yoga: {
		colors: ['#3A4B39', '#8a6b45'],
		svg: '<circle cx="160" cy="70" r="16" fill="rgba(252,250,244,.5)"/><path d="M60,170 Q160,40 260,170" stroke="rgba(252,250,244,.45)" stroke-width="5" fill="none"/>'
	},
	Breathwork: {
		colors: ['#2c4a52', '#8fb9c4'],
		svg: '<circle cx="160" cy="100" r="22" fill="rgba(252,250,244,.4)"/><circle cx="160" cy="100" r="46" fill="none" stroke="rgba(252,250,244,.3)" stroke-width="3"/><circle cx="160" cy="100" r="72" fill="none" stroke="rgba(252,250,244,.2)" stroke-width="3"/>'
	},
	'Qi Gong': {
		colors: ['#4a3820', '#C4922A'],
		svg: '<path d="M30,120 C90,40 140,170 200,90 S280,70 300,100" stroke="rgba(252,250,244,.5)" stroke-width="5" fill="none"/><path d="M30,150 C90,80 140,190 200,120 S280,110 300,130" stroke="rgba(252,250,244,.28)" stroke-width="4" fill="none"/>'
	},
	Meditation: {
		colors: ['#1f2a1f', '#677652'],
		svg: '<circle cx="160" cy="105" r="34" fill="rgba(255,230,180,.55)"/><rect x="0" y="120" width="320" height="80" fill="rgba(0,0,0,.22)"/>'
	},
	Movement: {
		colors: ['#60482F', '#c9ad7d'],
		svg: '<path d="M40,150 L90,60 L140,150 L190,60 L240,150 L290,60" stroke="rgba(252,250,244,.45)" stroke-width="5" fill="none" stroke-linejoin="round"/>'
	},
	Forum: {
		colors: ['#1a2430', '#4A7B8A'],
		svg: '<circle cx="160" cy="100" r="62" fill="none" stroke="rgba(252,250,244,.25)" stroke-width="3"/>' + forumDots
	}
};

export const COURSE_SVG =
	'<path d="M0,150 Q80,100 160,140 T320,120 L320,200 L0,200Z" fill="rgba(0,0,0,.2)"/><circle cx="240" cy="60" r="22" fill="rgba(255,230,180,.5)"/>';

export const gradient = ([a, b]: readonly string[]) => `background:linear-gradient(160deg,${a},${b})`;
export const percent = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

/** "Monday 30 November, 08:00" in Lisbon time. */
export const formatSession = (iso: string) =>
	new Date(iso).toLocaleString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Lisbon'
	});
