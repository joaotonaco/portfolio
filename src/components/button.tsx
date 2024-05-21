import { cn } from "@/lib/utils";
import type React from "react";

type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				"bg-primary text-background px-8 py-2 rounded-full font-semibold hover:bg-primary/80",
				className,
			)}
			{...props}
		/>
	);
}
