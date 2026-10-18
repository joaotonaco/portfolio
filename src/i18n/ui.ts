export const locales = ["en", "pt-br"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
export type Localized = Record<Locale, string>;

export const htmlLang: Record<Locale, string> = {
	en: "en",
	"pt-br": "pt-BR",
};

const en = {
	"meta.title": "João Gabriel · Full-stack Engineer",
	"meta.description":
		"Full-stack engineer from Brazil building web products with TypeScript, React and Node.",
	"header.role": "Full-stack engineer",
	"header.timeSame": "same as you",
	"header.timeAhead": "{h} ahead of you",
	"header.timeBehind": "{h} behind you",
	"header.theme": "Toggle theme",
	"header.language": "Language",
	"hero.title": "I build web products end to end, from the database to the {highlight}.",
	"hero.highlight": "last pixel",
	"hero.intro":
		"Hi, I'm João, a full-stack engineer from Brazil who cares about the details. Mostly in TypeScript land: React and Vite on the front, Node and Elysia on the back.",
	"hero.basedIn": "Based in",
	"hero.place": "Goiânia, BR",
	"hero.currently": "Currently",
	"hero.currentlyValue": "Full-stack at {company}",
	"hero.focus": "Focus",
	"hero.focusValue": "Product UI & APIs",
	"about.email": "Send email",
	"about.copy": "Copy email",
	"about.copied": "Email copied",
	"experience.label": "Experience",
	"experience.present": "Present",
	"projects.label": "Projects",
	"projects.more": "More on GitHub",
	"projects.author": "Author",
	"projects.contributor": "Contributor",
	"contributions.label": "Contributions",
	"contributions.total": "{n} contributions in the last year",
	"contributions.less": "Less",
	"contributions.more": "More",
	"contributions.tooltipOne": "{n} contribution on {date}",
	"contributions.tooltipOther": "{n} contributions on {date}",
	"contributions.empty": "Couldn't load contributions right now.",
	"stack.label": "Stack",
	"stack.caption": "Tools I reach for every day",
	"footer.made": "Made by João Gabriel",
	"notFound.title": "Page not found",
	"notFound.back": "Back home",
};

export type UIKey = keyof typeof en;

const ptBr: Record<UIKey, string> = {
	"meta.title": "João Gabriel · Engenheiro Full-stack",
	"meta.description":
		"Engenheiro full-stack do Brasil criando produtos web com TypeScript, React e Node.",
	"header.role": "Engenheiro full-stack",
	"header.timeSame": "mesmo que você",
	"header.timeAhead": "{h} à sua frente",
	"header.timeBehind": "{h} atrás de você",
	"header.theme": "Trocar tema",
	"header.language": "Idioma",
	"hero.title": "Construo produtos web de ponta a ponta, do banco de dados ao {highlight}.",
	"hero.highlight": "último pixel",
	"hero.intro":
		"Oi, sou o João, engenheiro full-stack do Brasil que se importa com os detalhes. Quase sempre em TypeScript: React e Vite no front, Node e Elysia no back.",
	"hero.basedIn": "Baseado em",
	"hero.place": "Goiânia, BR",
	"hero.currently": "Atualmente",
	"hero.currentlyValue": "Full-stack na {company}",
	"hero.focus": "Foco",
	"hero.focusValue": "UI de produto & APIs",
	"about.email": "Enviar e-mail",
	"about.copy": "Copiar e-mail",
	"about.copied": "E-mail copiado",
	"experience.label": "Experiência",
	"experience.present": "Atual",
	"projects.label": "Projetos",
	"projects.more": "Mais no GitHub",
	"projects.author": "Autor",
	"projects.contributor": "Contribuidor",
	"contributions.label": "Contribuições",
	"contributions.total": "{n} contribuições no último ano",
	"contributions.less": "Menos",
	"contributions.more": "Mais",
	"contributions.tooltipOne": "{n} contribuição em {date}",
	"contributions.tooltipOther": "{n} contribuições em {date}",
	"contributions.empty": "Não foi possível carregar as contribuições agora.",
	"stack.label": "Stack",
	"stack.caption": "Ferramentas que uso todo dia",
	"footer.made": "Feito por João Gabriel",
	"notFound.title": "Página não encontrada",
	"notFound.back": "Voltar ao início",
};

export const ui: Record<Locale, Record<UIKey, string>> = {
	en,
	"pt-br": ptBr,
};
