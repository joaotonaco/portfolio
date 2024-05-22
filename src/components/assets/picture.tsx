import Image from "next/image";

export function Picture() {
	return (
		<Image
			className="rounded-full size-16 grayscale pointer-events-none"
			src="/assets/picture.jpg"
			alt="Picture of me"
			width={200}
			height={200}
		/>
	);
}
