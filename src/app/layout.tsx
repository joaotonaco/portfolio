import type { Metadata } from "next";
import Font from "next/font/local";
import "./globals.css";

const font = Font({ src: "../../public/fonts/Satoshi-Variable.ttf" });

export const metadata: Metadata = {
	title: "João Gabriel Tonaco",
	description: "Front-end developer",
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
