import Link from "next/link";
import { Button } from "../ui/button";

export function ContactMe() {
	return (
		<Link href="mailto:joao.tonaco@proton.me" passHref>
			<Button>Contact me</Button>
		</Link>
	);
}
