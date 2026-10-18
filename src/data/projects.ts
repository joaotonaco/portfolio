import type { Localized } from "@/i18n/ui";

export interface Project {
	name: string;
	href: string;
	role: "author" | "contributor";
	description: Localized;
}

export const projects: Project[] = [
	{
		name: "better-drizzle",
		href: "https://github.com/almeidazs/better-drizzle",
		role: "contributor",
		description: {
			en: "Type-safe repository layer for Drizzle ORM. Shipped relation ordering, $where() and write fixes.",
			"pt-br":
				"Camada de repositório type-safe para o Drizzle ORM. Entreguei ordenação por relações, $where() e correções de escrita.",
		},
	},
	{
		name: "evolution-sdk",
		href: "https://github.com/solufyapp/evolution-sdk",
		role: "author",
		description: {
			en: "Unofficial SDK for Evolution Whatsapp API.",
			"pt-br": "SDK não oficial para a API do Evolution Whatsapp.",
		},
	},
	{
		name: "appmax-api-sdk",
		href: "https://github.com/joaotonaco/appmax-api-sdk",
		role: "author",
		description: {
			en: "Unofficial Node.js SDK for the Appmax checkout API, published on npm.",
			"pt-br": "SDK Node.js não oficial para a API de checkout da Appmax, publicado no npm.",
		},
	},
	{
		name: "WebP Compressor",
		href: "https://github.com/joaotonaco/webp-compressor",
		role: "author",
		description: {
			en: "Opinionated batch image to WebP compressor built with Next.js and sharp.",
			"pt-br": "Compressor opinativo de imagens em lote para WebP, feito com Next.js e sharp.",
		},
	},
];

export const githubUrl = "https://github.com/joaotonaco";
