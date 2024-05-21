type SquareCloudProps = {
	className?: string;
};

export function SquareCloud({ className }: SquareCloudProps) {
	return (
		<svg
			width="120"
			height="120"
			viewBox="0 0 120 120"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<title>Square Cloud Logo</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M97 23H9V111H97V23ZM3 17V117H103V17H3Z"
				fill="white"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M111 9H23V23H17V3H117V103H97V97H111V9ZM91 103V97H23V29H17V103H91Z"
				fill="white"
			/>
		</svg>
	);
}
