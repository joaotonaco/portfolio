import { defaultLocale, htmlLang, type Locale, locales, type UIKey, ui } from "./ui";

export function isLocale(value: unknown): value is Locale {
	return locales.includes(value as Locale);
}

export function getLocale(value: string | undefined): Locale {
	return isLocale(value) ? value : defaultLocale;
}

export function useTranslations(locale: Locale) {
	return function t(key: UIKey, vars?: Record<string, string | number>) {
		let text = ui[locale][key];
		for (const [name, value] of Object.entries(vars ?? {})) {
			text = text.replace(`{${name}}`, String(value));
		}
		return text;
	};
}

export function localizedPath(locale: Locale, path = "/") {
	const clean = path.replace(/^\/+/, "");
	return `/${locale}/${clean}`;
}

/** `YYYY-MM` to "Jan 2025" / "jan 2025". */
export function formatMonth(locale: Locale, date: string) {
	const [year, month] = date.split("-").map(Number);
	const name = new Intl.DateTimeFormat(htmlLang[locale], { month: "short", timeZone: "UTC" })
		.format(new Date(Date.UTC(year, (month ?? 1) - 1)))
		.replace(".", "");
	return `${name} ${year}`;
}
