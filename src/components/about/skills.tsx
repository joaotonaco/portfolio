import React from "react";
import { Dot } from "../ui/dot";

export function Skills() {
	const skills = ["TypeScript", "React", "Next.js", "Node.js", "UI/UX"];

	return (
		<div className="flex flex-col gap-2">
			<h2>My skills</h2>

			<ul className="flex flex-wrap gap-3 items-center text-secondary">
				{skills.map((skill, index) => (
					<React.Fragment key={skill}>
						<li>{skill}</li>
						{index < skills.length - 1 && <Dot />}
					</React.Fragment>
				))}
			</ul>
		</div>
	);
}
