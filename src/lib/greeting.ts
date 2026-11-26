/** Greeting for the hour in the given IANA time zone (the runtime's own zone when omitted). Unknown zones fall back to Lisbon. */
export function greeting(timeZone?: string, now = new Date()) {
	let h: number;
	try {
		h = Number(new Intl.DateTimeFormat('en', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(now));
	} catch {
		return greeting('Europe/Lisbon', now);
	}
	return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 18 ? 'Good afternoon' : 'Good evening';
}
