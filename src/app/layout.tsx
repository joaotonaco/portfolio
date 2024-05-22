import type { Metadata } from "next";
import Font from "next/font/local";
import "./globals.css";

const font = Font({ src: "../../public/fonts/Satoshi-Variable.ttf" });

export const metadata: Metadata = {
	title: "joaotonaco.dev",
	description: "Frontend Software Engineer",
	openGraph: {
		type: "website",
	},
	authors: [
		{ name: "João Gabriel Tonaco", url: "https://github.com/joaotonaco" },
	],
	keywords: ["frontend", "developer", "software"],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={font.className}>{children}</body>
		</html>
	);
}
