import { Picture } from "../assets/picture";

export function Title() {
	return (
		<div className="space-y-4">
			<Picture />

			<div className="flex items-baseline">
				<h1 className="text-lg font-semibold">Hi, I'm João</h1>
				<p className="text-lg text-primary/70">
					, but you can call me <span className="text-blue-400">Bluey</span>
				</p>
			</div>
		</div>
	);
}
