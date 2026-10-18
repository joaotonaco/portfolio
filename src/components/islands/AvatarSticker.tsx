import { type PointerEvent, useRef } from "react";

interface Props {
	src: string;
	alt: string;
	className?: string;
}

/** Underdamped spring sampled into a CSS `linear()` easing (~16% overshoot). */
function springEasing(damping = 0.5, samples = 40) {
	const omega = 5.5 / damping;
	const omegaD = omega * Math.sqrt(1 - damping ** 2);
	const points: string[] = [];
	for (let i = 0; i <= samples; i++) {
		const t = i / samples;
		const decay = Math.exp(-damping * omega * t);
		const x =
			1 - decay * (Math.cos(omegaD * t) + ((damping * omega) / omegaD) * Math.sin(omegaD * t));
		points.push((i === samples ? 1 : x).toFixed(3));
	}
	return `linear(${points.join(", ")})`;
}

const SPRING = springEasing();
const REACH = 140;
const LIFT = "scale(1.08)";

/** Pulls harder the further it goes, so the sticker never flies off. */
const rubberBand = (distance: number) =>
	Math.sign(distance) * REACH * (1 - Math.exp(-Math.abs(distance) / REACH));

export default function AvatarSticker({ src, alt, className = "" }: Props) {
	const sticker = useRef<HTMLDivElement>(null);
	const drag = useRef<{ id: number; x: number; y: number } | null>(null);

	function onPointerDown(event: PointerEvent<HTMLDivElement>) {
		const node = sticker.current;
		// Ignore extra fingers once a drag is under way.
		if (!node || drag.current || event.button !== 0) return;
		// Keeps the drag alive when the pointer outruns the sticker.
		try {
			node.setPointerCapture(event.pointerId);
		} catch {}
		drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
		node.dataset.dragging = "";
		node.style.transition = "transform 160ms var(--ease-out), box-shadow 160ms ease";
		node.style.transform = LIFT;
	}

	function onPointerMove(event: PointerEvent<HTMLDivElement>) {
		const node = sticker.current;
		const start = drag.current;
		if (!node || !start || event.pointerId !== start.id) return;
		const x = rubberBand(event.clientX - start.x);
		const y = rubberBand(event.clientY - start.y);
		const tilt = Math.max(-14, Math.min(14, x * 0.12));
		node.style.transition = "box-shadow 160ms ease";
		node.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg) ${LIFT}`;
	}

	function onPointerUp(event: PointerEvent<HTMLDivElement>) {
		const node = sticker.current;
		const start = drag.current;
		if (!node || !start || event.pointerId !== start.id) return;
		drag.current = null;
		delete node.dataset.dragging;
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		node.style.transition = reduce
			? "transform 200ms var(--ease-out), box-shadow 200ms ease"
			: `transform 750ms ${SPRING}, box-shadow 300ms ease`;
		node.style.transform = "";
		// Hand control back to the stylesheet (hover tilt) once it settles.
		node.addEventListener(
			"transitionend",
			() => {
				if (!drag.current) node.style.transition = "";
			},
			{ once: true },
		);
	}

	return (
		<div
			ref={sticker}
			className={`sticker ${className}`}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
		>
			<img
				src={src}
				alt={alt}
				width={64}
				height={64}
				draggable={false}
				loading="eager"
				decoding="async"
				className="size-full rounded-[9px] object-cover"
			/>
		</div>
	);
}
