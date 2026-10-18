import type { ImageMetadata } from "astro";
import lunee from "@/assets/logos/luneeapp.png";
import solufy from "@/assets/logos/solufyapp.png";
import squarecloud from "@/assets/logos/squarecloudofc.png";
import type { Localized } from "@/i18n/ui";

export interface Experience {
	company: string;
	url: string;
	logo: ImageMetadata;
	role: Localized;
	/** `YYYY-MM` */
	start: string;
	/** `YYYY-MM`, or `null` while ongoing */
	end: string | null;
	location: Localized;
}

export const experience: Experience[] = [
	{
		company: "Solufy",
		url: "https://solufy.app",
		logo: solufy,
		role: { en: "Full-stack Engineer", "pt-br": "Engenheiro Full-stack" },
		start: "2025-01",
		end: null,
		location: { en: "Remote", "pt-br": "Remoto" },
	},
	{
		company: "Lunee",
		url: "https://github.com/luneeapp",
		logo: lunee,
		role: { en: "Full-stack Engineer", "pt-br": "Engenheiro Full-stack" },
		start: "2026-04",
		end: null,
		location: { en: "Remote", "pt-br": "Remoto" },
	},
	{
		company: "Square Cloud",
		url: "https://squarecloud.app",
		logo: squarecloud,
		role: { en: "Frontend Engineer", "pt-br": "Engenheiro Frontend" },
		start: "2023-06",
		end: "2026-03",
		location: { en: "Remote", "pt-br": "Remoto" },
	},
];
