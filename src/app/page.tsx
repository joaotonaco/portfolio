import { Button } from "@/components/button";
import { Dot } from "@/components/dot";
import { Link } from "@/components/link";
import { SquareCloud } from "@/components/squarecloud";

export default function Home() {
	return (
		<main className="min-h-screen w-full bg-background text-primary flex flex-col px-16 py-8">
			<header className="ml-auto flex items-center gap-8 text-secondary">
				<Link href="https://github.com/joaotonaco">Github</Link>
				<Link href="https://x.com/jaootonaco">Twitter / X</Link>
			</header>

			<section className="flex-1 flex items-center justify-center">
				<div className="max-w-2xl w-full flex flex-col items-start gap-8">
					<div className="flex items-baseline">
						<h1 className="text-lg font-semibold">Hi, I'm João</h1>
						<p className="text-lg text-primary/70">
							, but you can call me Bluey
						</p>
					</div>

					<div className="text-secondary max-w-md">
						<p>
							I'm a{" "}
							<span className="font-medium">Frontend Software Engineer</span>,
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

					<Button>Contact me</Button>
				</div>
			</section>
		</main>
	);
}
