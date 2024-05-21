import { cn } from "@/lib/utils";
import NextLink from "next/link";
import type React from "react";

type LinkProps = React.ComponentProps<typeof NextLink>;

export function Link({ className, ...props }: LinkProps) {
	return (
		<NextLink
			className={cn(
				"text-primary underline-offset-4 hover:underline",
				className,
			)}
			{...props}
		/>
	);
}
