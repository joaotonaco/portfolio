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

/** Columns of 7 days, Sunday first; the first week is padded with `null`. */
function toWeeks(days: ContributionDay[]) {
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
	return weeks;
}

/** An empty year with real dates, so the loading state has the same shape as the graph. */
export function placeholderWeeks(): (ContributionDay | null)[][] {
	const today = Date.UTC(
		new Date().getUTCFullYear(),
		new Date().getUTCMonth(),
		new Date().getUTCDate(),
	);
	const days = Array.from({ length: 365 }, (_, i) => ({
		date: new Date(today - (364 - i) * 86_400_000).toISOString().slice(0, 10),
		count: 0,
		level: 0 as const,
	}));
	return toWeeks(days);
}
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

		return { total: data.total.lastYear, weeks: toWeeks(days) };
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
