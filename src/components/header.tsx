import { Link } from "./ui/link";

export function Header() {
	const links = [
		{
			label: "Github",
			href: "https://github.com/joaotonaco",
		},
		{
			label: "Twitter / X",
			href: "https://x.com/jaootonaco",
		},
	];

	return (
		<header className="ml-auto flex items-center gap-8 text-secondary">
			{links.map(({ label, href }) => (
				<Link key={label} href={href}>
					{label}
				</Link>
			))}
		</header>
	);
}
