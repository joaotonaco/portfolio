import type { Localized } from "@/i18n/ui";

import {
	siDocker,
	siGit,
	siMongodb,
	siNestjs,
	siNextdotjs,
	siNodedotjs,
	siOxc,
	siPostgresql,
	siReact,
	siTanstack,
	siTailwindcss,
	siTypescript,
	siVite,
} from "simple-icons";

import elysiaSvg from "@/assets/icons/elysia.svg?raw";

export interface Tool {
	name: string;
	/** SVG path on a 24×24 viewBox. */
	path?: string;
	/** Clips the square badge to rounded corners, like the official rounded logo. */
	rounded?: boolean;
	/** Full multi-tone SVG markup, for logos that aren't a single path. */
	svg?: string;
	/** Brand color, revealed on hover. Monochrome brands use the text color. */
	color: string;
	kind: Localized;
}

const language = { en: "Language", "pt-br": "Linguagem" };
const frontend = { en: "Frontend", "pt-br": "Frontend" };
const backend = { en: "Backend", "pt-br": "Backend" };
const data = { en: "Database", "pt-br": "Banco de dados" };
const tooling = { en: "Tooling", "pt-br": "Ferramentas" };

export const stack: Tool[] = [
	{
		name: "TypeScript",
		path: siTypescript.path,
		color: `#${siTypescript.hex}`,
		kind: language,
		rounded: true,
	},
	{ name: "React", path: siReact.path, color: `#${siReact.hex}`, kind: frontend },
	{ name: "Next.js", path: siNextdotjs.path, color: "var(--foreground)", kind: frontend },
	{ name: "TanStack", path: siTanstack.path, color: "var(--foreground)", kind: frontend },
	{ name: "Vite", path: siVite.path, color: `#${siVite.hex}`, kind: frontend },
	{
		name: "Tailwind CSS",
		path: siTailwindcss.path,
		color: `#${siTailwindcss.hex}`,
		kind: frontend,
	},
	{ name: "Node.js", path: siNodedotjs.path, color: `#${siNodedotjs.hex}`, kind: backend },
	{ name: "NestJS", path: siNestjs.path, color: `#${siNestjs.hex}`, kind: backend },
	{ name: "Elysia", svg: elysiaSvg, color: "#C026D3", kind: backend },
	{ name: "PostgreSQL", path: siPostgresql.path, color: `#${siPostgresql.hex}`, kind: data },
	{ name: "MongoDB", path: siMongodb.path, color: `#${siMongodb.hex}`, kind: data },
	{ name: "Docker", path: siDocker.path, color: `#${siDocker.hex}`, kind: tooling },
	{ name: "Git", path: siGit.path, color: `#${siGit.hex}`, kind: tooling },
	{ name: "OXC", path: siOxc.path, color: `#${siOxc.hex}`, kind: tooling },
];
