import { ContactMe } from "./contact-me";
import { Description } from "./description";
import { Skills } from "./skills";
import { Title } from "./title";

export function About() {
	return (
		<section className="flex-1 flex items-center justify-center">
			<div className="max-w-2xl w-full flex flex-col items-start gap-8">
				<Title />
				<Description />
				<Skills />
				<ContactMe />
			</div>
		</section>
	);
}
