const SYNODIC_DAYS = 29.530588861;
const REFERENCE = Date.UTC(2000, 0, 6, 18, 14); // a known new moon

// shortcut: astronomical mean new moon, can be off by about a day; replace with a fixed list of circle dates.
/** The next `n` new moons from `now`, as Lisbon calendar dates (YYYY-MM-DD). */
export function nextNewMoons(n: number, now = Date.now()): string[] {
	const k = Math.ceil((now - REFERENCE) / 864e5 / SYNODIC_DAYS);
	return Array.from({ length: n }, (_, i) =>
		new Date(REFERENCE + (k + i) * SYNODIC_DAYS * 864e5).toLocaleDateString('en-CA', {
			timeZone: 'Europe/Lisbon'
		})
	);
}

/** "Monday 1 December" for a YYYY-MM-DD date. */
export const formatDay = (day: string) =>
	new Date(day + 'T12:00:00Z').toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		timeZone: 'Europe/Lisbon'
	});
