import { About } from "@/components/about";
import { Header } from "@/components/header";

export default function Home() {
	return (
		<main className="min-h-screen w-full bg-background text-primary flex flex-col px-8 md:px-16 py-8">
			<Header />
			<About />
		</main>
	);
}
