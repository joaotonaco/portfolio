import { type ClassNameValue, twMerge } from "tailwind-merge";

export function cn(...classNames: ClassNameValue[]) {
	return twMerge(classNames);
}
