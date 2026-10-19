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

/** Taps this close together count toward the lightning easter egg. */
const TAP_GAP = 400;
const TAPS_TO_STRIKE = 10;
const TAP_SLOP = 6;
/** Tap counts that crackle with growing static before the full strike. */
const HINTS: Record<number, 1 | 2 | 3> = { 1: 1, 5: 2, 7: 3 };

/** Drag afterimages: sparse on purpose, so it reads as a trace rather than a smear. */
const GHOST_EVERY = 110;
const GHOST_SPACING = 36;
const GHOST_OPACITY = 0.28;
const GHOST_LIFE = 1100;
const MAX_GHOSTS = 8;

let lightning: Promise<typeof import("@/lib/lightning")> | undefined;
const loadLightning = () => (lightning ??= import("@/lib/lightning"));

const rubberBand = (distance: number) =>
	Math.sign(distance) * REACH * (1 - Math.exp(-Math.abs(distance) / REACH));

export default function AvatarSticker({ src, alt, className = "" }: Props) {
	const sticker = useRef<HTMLDivElement>(null);
	const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
	const taps = useRef({ count: 0, last: 0 });
	const trail = useRef<HTMLDivElement>(null);
	const lastGhost = useRef({ x: 0, y: 0, t: 0 });

	/** Drops a faded copy of the sticker at its current drag position, which then fades away. */
	function leaveGhost(transform: string) {
		const node = sticker.current;
		const layer = trail.current;
		if (!node || !layer || layer.childElementCount >= MAX_GHOSTS) return;
		const ghost = node.cloneNode(true) as HTMLDivElement;
		ghost.removeAttribute("data-dragging");
		ghost.className = "sticker sticker-ghost";
		ghost.style.cssText = "";
		layer.append(ghost);
		const remove = () => ghost.remove();
		ghost
			.animate(
				[
					{ opacity: GHOST_OPACITY, transform },
					{ opacity: 0, transform: `${transform} scale(0.9)` },
				],
				{ duration: GHOST_LIFE, easing: "ease-out", fill: "forwards" },
			)
			.finished.then(remove, remove);
	}

	function onTap() {
		const now = performance.now();
		const tally = taps.current;
		tally.count = now - tally.last < TAP_GAP ? tally.count + 1 : 1;
		tally.last = now;
		const node = sticker.current;
		if (!node) return;
		const box = node.getBoundingClientRect();
		const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
		const hint = HINTS[tally.count];
		if (hint) loadLightning().then(({ crackle }) => crackle(center, box.width / 2, hint));
		if (tally.count < TAPS_TO_STRIKE) return;
		tally.count = 0;
		loadLightning().then(({ strike }) => strike(center));
		node
			.querySelector("img")
			?.animate(
				[
					{ transform: "translate(0, 0)", filter: "brightness(1.8) saturate(1.4)" },
					{ transform: "translate(-2px, 1px)" },
					{ transform: "translate(2px, -1px)" },
					{ transform: "translate(-1px, -1px)" },
					{ transform: "translate(1px, 1px)" },
					{ transform: "translate(0, 0)", filter: "brightness(1) saturate(1)" },
				],
				{ duration: 360, easing: "ease-out" },
			);
	}

	function onPointerDown(event: PointerEvent<HTMLDivElement>) {
		const node = sticker.current;
		if (!node || drag.current || event.button !== 0) return;
		try {
			node.setPointerCapture(event.pointerId);
		} catch {}
		void loadLightning();
		drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
		node.dataset.dragging = "";
		lastGhost.current = { x: 0, y: 0, t: performance.now() };
		node.style.transition = "transform 160ms var(--ease-out), box-shadow 160ms ease";
		node.style.transform = LIFT;
	}

	function onPointerMove(event: PointerEvent<HTMLDivElement>) {
		const node = sticker.current;
		const start = drag.current;
		if (!node || !start || event.pointerId !== start.id) return;
		if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) start.moved = true;
		const x = rubberBand(event.clientX - start.x);
		const y = rubberBand(event.clientY - start.y);
		const tilt = Math.max(-14, Math.min(14, x * 0.12));
		const transform = `translate(${x}px, ${y}px) rotate(${tilt}deg) ${LIFT}`;
		node.style.transition = "box-shadow 160ms ease";
		node.style.transform = transform;

		const now = performance.now();
		const last = lastGhost.current;
		if (now - last.t < GHOST_EVERY || Math.hypot(x - last.x, y - last.y) < GHOST_SPACING) return;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		lastGhost.current = { x, y, t: now };
		leaveGhost(transform);
	}

	function onPointerUp(event: PointerEvent<HTMLDivElement>) {
		const node = sticker.current;
		const start = drag.current;
		if (!node || !start || event.pointerId !== start.id) return;
		drag.current = null;
		delete node.dataset.dragging;
		if (event.type === "pointerup" && !start.moved) onTap();
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		node.style.transition = reduce
			? "transform 200ms var(--ease-out), box-shadow 200ms ease"
			: `transform 750ms ${SPRING}, box-shadow 300ms ease`;
		node.style.transform = "";
		node.addEventListener(
			"transitionend",
			() => {
				if (!drag.current) node.style.transition = "";
			},
			{ once: true },
		);
	}

	return (
		<div className={`relative ${className}`}>
			<div ref={trail} aria-hidden="true" className="pointer-events-none absolute inset-0" />
			<div
				ref={sticker}
				className="sticker size-full"
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
		</div>
	);
}
