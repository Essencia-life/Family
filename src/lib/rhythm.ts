const day = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Europe/Lisbon' });

/** The last 7 days (oldest first, Lisbon time) with whether a practice was marked that day, and the mornings this month. */
export function rhythm(practisedAt: string[], now = Date.now()) {
	const days = new Set(practisedAt.map((t) => day(Date.parse(t))));
	const week = Array.from({ length: 7 }, (_, i) => {
		const t = now - (6 - i) * 864e5;
		const label = new Date(t).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'Europe/Lisbon' }).slice(0, 2);
		return { label, on: days.has(day(t)), today: i === 6 };
	});
	const month = day(now).slice(0, 7);
	return { week, thisMonth: [...days].filter((d) => d.startsWith(month)).length };
}
