export interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
	total: number;
	weeks: (ContributionDay | null)[][];
}

const USERNAME = "joaotonaco";
const TTL = 24 * 60 * 60 * 1000;

let cache: { data: Contributions; fetchedAt: number } | undefined;
let pending: Promise<Contributions | null> | undefined;

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

function refresh() {
	pending ??= load()
		.then((data) => {
			if (data) cache = { data, fetchedAt: Date.now() };
			return data ?? cache?.data ?? null;
		})
		.finally(() => {
			pending = undefined;
		});
	return pending;
}

export async function getContributions() {
	if (!cache) return refresh();
	if (Date.now() - cache.fetchedAt > TTL) void refresh();
	return cache.data;
}
