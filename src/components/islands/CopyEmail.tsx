import { useEffect, useRef, useState } from "react";

interface Props {
	email: string;
	labels: { copy: string; copied: string };
}

const iconBase =
	"motion-transform col-start-1 row-start-1 transition-[opacity,scale,filter] duration-200 ease-out";
const hidden = "scale-90 opacity-0 blur-[2px]";

export default function CopyEmail({ email, labels }: Props) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(email);
		} catch {
			return;
		}
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 2000);
	}

	const label = copied ? labels.copied : labels.copy;

	return (
		<button
			type="button"
			onClick={copy}
			aria-label={label}
			title={label}
			className="pressable grid size-9 place-items-center rounded-lg border border-border text-muted hover:bg-subtle hover:text-foreground"
		>
			<svg
				aria-hidden="true"
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={`${iconBase} ${copied ? hidden : ""}`}
			>
				<rect x="9" y="9" width="12" height="12" rx="2" />
				<path d="M5 15V5a2 2 0 0 1 2-2h10" />
			</svg>
			<svg
				aria-hidden="true"
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.25"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={`${iconBase} text-emerald-500 ${copied ? "" : hidden}`}
			>
				<path d="m5 12 5 5L20 7" />
			</svg>
			<span className="sr-only" aria-live="polite">
				{copied ? labels.copied : ""}
			</span>
		</button>
	);
}
