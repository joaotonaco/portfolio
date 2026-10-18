import { useSyncExternalStore } from "react";

import { htmlLang, type Locale } from "@/i18n/ui";

interface Props {
	timeZone: string;
	locale: Locale;
	labels: { same: string; ahead: string; behind: string };
}

/** Minutes east of UTC for `timeZone` at `date`. */
function zoneOffset(timeZone: string, date: Date) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hourCycle: "h23",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).formatToParts(date);
	const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
	const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
	return Math.round((asUtc - date.getTime()) / 60_000);
}

function relativeLabel(diffMinutes: number, labels: Props["labels"]) {
	if (diffMinutes === 0) return labels.same;
	const hours = Math.abs(diffMinutes) / 60;
	const h = `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
	return (diffMinutes > 0 ? labels.ahead : labels.behind).replace("{h}", h);
}
/** Re-renders on every minute boundary. */
function subscribe(onChange: () => void) {
	let interval: ReturnType<typeof setInterval> | undefined;
	const timeout = setTimeout(
		() => {
			onChange();
			interval = setInterval(onChange, 60_000);
		},
		60_000 - (Date.now() % 60_000),
	);
	return () => {
		clearTimeout(timeout);
		clearInterval(interval);
	};
}

const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

export default function LocalTime({ timeZone, locale, labels }: Props) {
	const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
	const now = minute === null ? null : new Date(minute * 60_000);
	const time = now
		? new Intl.DateTimeFormat(htmlLang[locale], {
				timeZone,
				hour: "2-digit",
				minute: "2-digit",
			}).format(now)
		: "00:00";
	const diff = now ? zoneOffset(timeZone, now) + now.getTimezoneOffset() : 0;

	return (
		<p
			className="flex items-center gap-1.5 font-mono text-xs text-muted transition-opacity duration-200 ease-out data-[ready=false]:opacity-0"
			data-ready={now !== null}
		>
			<span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
			<time className="shrink-0 whitespace-nowrap tabular-nums">{time}</time>
			<span aria-hidden="true">·</span>
			<span className="truncate">{relativeLabel(diff, labels)}</span>
		</p>
	);
}
