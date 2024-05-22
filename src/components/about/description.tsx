import { SquareCloud } from "../assets/squarecloud";
import { Link } from "../ui/link";

export function Description() {
	return (
		<div className="text-secondary max-w-md">
			<p>
				I'm a <span className="text-primary">Frontend Software Engineer</span>,
				based in Brazil.
			</p>

			<p>Passionate in crafting with engineering and design principles.</p>

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
	);
}
