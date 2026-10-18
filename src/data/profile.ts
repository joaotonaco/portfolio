import avatar from "@/assets/avatar.jpg";

export const profile = {
	name: "João Gabriel",
	avatar,
	email: "joao.tonaco@proton.me",
	timeZone: "America/Sao_Paulo",
	company: { name: "Solufy", url: "https://solufy.app" },
	socials: [
		{ label: "GitHub", href: "https://github.com/joaotonaco", icon: "github" },
		{ label: "X", href: "https://x.com/jaootonaco", icon: "x" },
		{ label: "Discord", href: "https://discord.com/users/702529018410303640", icon: "discord" },
	],
} as const;

export type SocialIcon = (typeof profile.socials)[number]["icon"];
