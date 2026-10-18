import type { ContributionDay } from "@/lib/github";

import { type PointerEvent, useRef, useState } from "react";

import { htmlLang, type Locale } from "@/i18n/ui";

interface Props {
	weeks: (ContributionDay | null)[][];
	locale: Locale;
	label: string;
	/** Templates with `{n}` and `{date}`, picked by plural rule. */
	tooltip: { one: string; other: string };
}

interface Tip {
	text: string;
	x: number;
	y: number;
}

const levelClass = [
	"bg-[var(--graph-0)]",
	"bg-[var(--graph-1)]",
	"bg-[var(--graph-2)]",
	"bg-[var(--graph-3)]",
	"bg-[var(--graph-4)]",
];

function monthLabels(weeks: Props["weeks"], locale: Locale) {
	const format = new Intl.DateTimeFormat(htmlLang[locale], { month: "short", timeZone: "UTC" });
	const labels: { col: number; text: string }[] = [];
	let previous = -1;
	weeks.forEach((week, col) => {
		const first = week.find(Boolean);
		if (!first) return;
		const date = new Date(`${first.date}T00:00:00Z`);
		const month = date.getUTCMonth();
		if (month === previous) return;
		previous = month;
		if (labels.length === 0 && date.getUTCDate() > 7) return;
		labels.push({ col, text: format.format(date).replace(".", "") });
	});
	return labels;
}

export default function ContributionGraph({ weeks, locale, label, tooltip }: Props) {
	const wrapper = useRef<HTMLDivElement>(null);
	const [tip, setTip] = useState<Tip | null>(null);
	const [visible, setVisible] = useState(false);

	const plural = new Intl.PluralRules(htmlLang[locale]);
	const dateFormat = new Intl.DateTimeFormat(htmlLang[locale], {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});

	function onPointerOver(event: PointerEvent<HTMLDivElement>) {
		const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-date]");
		const box = wrapper.current;
		if (!cell || !box) return;
		const rect = cell.getBoundingClientRect();
		const parent = box.getBoundingClientRect();
		const date = dateFormat.format(new Date(`${cell.dataset.date}T00:00:00Z`));
		const count = Number(cell.dataset.count ?? 0);
		const template = plural.select(count) === "one" ? tooltip.one : tooltip.other;
		setTip({
			text: template.replace("{n}", String(count)).replace("{date}", date),
			x: rect.left - parent.left + rect.width / 2,
			y: rect.top - parent.top,
		});
		setVisible(true);
	}

	const months = monthLabels(weeks, locale);
	const columns = { gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` };

	return (
		<div ref={wrapper} className="relative">
			<span className="sr-only">{label}</span>
			{/* rtl makes the scroller start at the newest weeks on narrow screens, no JS needed */}
			<div
				className="-mx-1 overflow-x-auto px-1 pb-3 [scrollbar-width:thin] [mask-image:linear-gradient(to_right,transparent,black_24px)] sm:pb-1 sm:[mask-image:none]"
				dir="rtl"
			>
				<div dir="ltr" className="min-w-[560px]">
					<div className="mb-1.5 grid font-mono text-[10px] text-muted" style={columns}>
						{months.map((m) => (
							<span
								key={m.col}
								style={{ gridColumnStart: m.col + 1 }}
								className="whitespace-nowrap"
							>
								{m.text}
							</span>
						))}
					</div>
					<div
						aria-hidden="true"
						className="grid grid-flow-col grid-rows-7 gap-[3px]"
						style={columns}
						onPointerOver={onPointerOver}
						onPointerLeave={() => setVisible(false)}
					>
						{weeks.flatMap((week, col) =>
							Array.from({ length: 7 }, (_, row) => {
								const day = week[row];
								const key = `${col}-${row}`;
								if (!day) return <span key={key} />;
								return (
									<span
										key={key}
										data-date={day.date}
										data-count={day.count}
										className={`aspect-square rounded-[2px] ${levelClass[day.level]}`}
									/>
								);
							}),
						)}
					</div>
				</div>
			</div>
			<div
				role="tooltip"
				aria-hidden="true"
				className="motion-transform pointer-events-none absolute z-10 origin-bottom -translate-x-1/2 -translate-y-full rounded-md bg-foreground px-2 py-1 font-mono text-[11px] whitespace-nowrap text-background shadow-sm transition-[opacity,scale] duration-[125ms] ease-out data-[visible=false]:scale-[0.97] data-[visible=false]:opacity-0"
				data-visible={visible && tip !== null}
				style={{ left: tip?.x ?? 0, top: (tip?.y ?? 0) - 6 }}
			>
				{tip?.text}
			</div>
		</div>
	);
}
