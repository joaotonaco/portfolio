export interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
	total: number;
	/** Columns of 7 days (Sunday first). Leading days of the first week may be `null`. */
	weeks: (ContributionDay | null)[][];
}

const USERNAME = "joaotonaco";
let cached: Promise<Contributions | null> | undefined;

async function load(): Promise<Contributions | null> {
	try {
		const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, {
			signal: AbortSignal.timeout(10_000),
		});
		if (!res.ok) return null;
		const data = (await res.json()) as {
			total: { lastYear: number };
			contributions: ContributionDay[];
		};
		const days = data.contributions;
		if (!days.length) return null;

		const weeks: (ContributionDay | null)[][] = [];
		const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
		let week: (ContributionDay | null)[] = Array(firstWeekday).fill(null);
		for (const day of days) {
			week.push(day);
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}
		if (week.length) weeks.push(week);

		return { total: data.total.lastYear, weeks };
	} catch {
		return null;
	}
}

/** Fetched once per build and shared between locales. Never throws. */
export function getContributions() {
	cached ??= load();
	return cached;
}
