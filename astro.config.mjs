// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://joaotonaco.dev",
	output: "static",
	adapter: node({ mode: "standalone" }),
	trailingSlash: "ignore",
	i18n: {
		locales: ["en", "pt-br"],
		defaultLocale: "en",
		routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
	},
	integrations: [
		react(),
		sitemap({
			i18n: { defaultLocale: "en", locales: { en: "en", "pt-br": "pt-BR" } },
			filter: (page) => new URL(page).pathname !== "/",
		}),
	],
	vite: { plugins: [tailwindcss()] },
});
