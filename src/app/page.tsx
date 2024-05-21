import { Button } from "@/components/button";
import { Dot } from "@/components/dot";
import { Link } from "@/components/link";
import { Picture } from "@/components/picture";
import { SquareCloud } from "@/components/squarecloud";
import NextLink from "next/link";

export default function Home() {
	return (
		<main className="min-h-screen w-full bg-background text-primary flex flex-col px-16 py-8">
			<header className="ml-auto flex items-center gap-8 text-secondary">
				<Link href="https://github.com/joaotonaco">Github</Link>
				<Link href="https://x.com/jaootonaco">Twitter / X</Link>
			</header>

			<section className="flex-1 flex items-center justify-center">
				<div className="max-w-2xl w-full flex flex-col items-start gap-8">
					<div className="space-y-4">
						<Picture />

						<div className="flex items-baseline">
							<h1 className="text-lg font-semibold">Hi, I'm João</h1>
							<p className="text-lg text-primary/70">
								, but you can call me{" "}
								<span className="text-blue-400">Bluey</span>
							</p>
						</div>
					</div>

					<div className="text-secondary max-w-md">
						<p>
							I'm a{" "}
							<span className="text-primary">Frontend Software Engineer</span>,
							based in Brazil.
						</p>

						<p>
							Passionate in crafting with engineering and design principles.
						</p>

						<p>
							Currently developing at{" "}
							<Link
								className="inline-flex items-center gap-1"
								href="https://squarecloud.app"
							>
								Square Cloud <SquareCloud className="inline size-4" />
							</Link>
							.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2>My skills</h2>

						<ul className="flex gap-3 items-center text-secondary">
							<li>TypeScript</li>
							<Dot />
							<li>React</li>
							<Dot />
							<li>Next.js</li>
							<Dot />
							<li>Node.js</li>
							<Dot />
							<li>UI/UX</li>
						</ul>
					</div>

					<NextLink href="mailto:joao.tonaco@proton.me" passHref>
						<Button>Contact me</Button>
					</NextLink>
				</div>
			</section>
		</main>
	);
}
