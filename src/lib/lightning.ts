interface Point {
	x: number;
	y: number;
}

/** A cartoon bolt segment: a zigzag spine plus a few hand-drawn "boil" variants of it. */
interface Zigzag {
	spine: Point[];
	boil: Point[][];
	width: number;
}

interface Bolt {
	parts: Zigzag[];
	born: number;
}

interface Puff {
	x: number;
	y: number;
	vx: number;
	vy: number;
	born: number;
	life: number;
	size: number;
}

/** Strike waves: delay (ms), bolt count and page flash strength. Kept to three flashes for photosensitivity. */
const WAVES = [
	{ at: 0, count: 6, flash: 0.9 },
	{ at: 300, count: 5, flash: 0.55 },
	{ at: 650, count: 4, flash: 0.3 },
];
const DURATION = 2400;
/** How fast each page-wide flash fades (ms), like the afterglow of a real strike. */
const FLASH_DECAY = 110;
/** Bolt lifecycle (ms): shoot out, hold while boiling, then zip away toward the tip. */
const SHOOT = 90;
const HOLD = 420;
const ZIP = 300;
/** Redraw the wobble at ~14fps, like hand-drawn animation on twos. */
const BOIL_FRAME = 70;

const INK = "#2456f0";
const FILL = "#e3f2ff";
const SHINE = "#ffffff";
const GLOW = "rgba(90, 170, 255, 0.35)";

let running = false;

const random = (min: number, max: number) => min + Math.random() * (max - min);

/** Distance from the origin to the viewport edge along an angle, so bolts always leave the screen. */
function reach(origin: Point, angle: number, w: number, h: number) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const tx = cos > 0 ? (w - origin.x) / cos : cos < 0 ? -origin.x / cos : Infinity;
	const ty = sin > 0 ? (h - origin.y) / sin : sin < 0 ? -origin.y / sin : Infinity;
	return Math.max(80, Math.min(tx, ty));
}

/** Sharp alternating zigzag, the way bolts are drawn in cartoons. */
function zigzag(from: Point, to: Point, width: number): Zigzag {
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	const length = Math.hypot(dx, dy) || 1;
	const nx = -dy / length;
	const ny = dx / length;
	const steps = Math.max(3, Math.round(length / 70));
	const side = Math.random() < 0.5 ? -1 : 1;
	const spine: Point[] = [];
	for (let i = 0; i <= steps; i++) {
		const along = i / steps;
		const swing =
			i === 0 || i === steps ? 0 : (i % 2 ? side : -side) * random(14, 30) * (width / 14);
		spine.push({ x: from.x + dx * along + nx * swing, y: from.y + dy * along + ny * swing });
	}
	const boil = Array.from({ length: 3 }, () =>
		spine.map((_, i) => (i === 0 ? { x: 0, y: 0 } : { x: random(-3, 3), y: random(-3, 3) })),
	);
	return { spine, boil, width };
}

function makeBolt(origin: Point, angle: number, born: number, w: number, h: number): Bolt {
	const length = reach(origin, angle, w, h) * random(1.05, 1.2);
	const end = { x: origin.x + Math.cos(angle) * length, y: origin.y + Math.sin(angle) * length };
	const main = zigzag(origin, end, 14);
	const parts = [main];
	const forks = Math.round(random(1, 3));
	for (let f = 0; f < forks; f++) {
		const at = main.spine[Math.floor(random(1, main.spine.length - 1))];
		const turn = angle + random(0.5, 0.9) * (Math.random() < 0.5 ? -1 : 1);
		const reachOut = length * random(0.18, 0.35);
		parts.push(
			zigzag(at, { x: at.x + Math.cos(turn) * reachOut, y: at.y + Math.sin(turn) * reachOut }, 7),
		);
	}
	return { parts, born };
}

/** The stretch of a polyline between fractions `from` and `to` of its vertex run. */
function slice(points: Point[], from: number, to: number): Point[] {
	const last = points.length - 1;
	const at = (f: number) => {
		const i = Math.min(last - 1, Math.floor(f * last));
		const k = f * last - i;
		const a = points[i];
		const b = points[i + 1];
		return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
	};
	const inner = points.slice(Math.floor(from * last) + 1, Math.ceil(to * last));
	return [at(from), ...inner, at(to)];
}

/** Tapered ribbon along `points`: full width at the base, a sharp point at the tip. */
function ribbon(ctx: CanvasRenderingContext2D, points: Point[], width: number) {
	const left: Point[] = [];
	const right: Point[] = [];
	const last = points.length - 1;
	points.forEach((p, i) => {
		const a = points[Math.max(0, i - 1)];
		const b = points[Math.min(last, i + 1)];
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const length = Math.hypot(dx, dy) || 1;
		const half = (width / 2) * (1 - 0.9 * (i / Math.max(1, last)));
		left.push({ x: p.x - (dy / length) * half, y: p.y + (dx / length) * half });
		right.push({ x: p.x + (dy / length) * half, y: p.y - (dx / length) * half });
	});
	ctx.beginPath();
	ctx.moveTo(left[0].x, left[0].y);
	for (const p of left.slice(1)) ctx.lineTo(p.x, p.y);
	for (const p of right.toReversed()) ctx.lineTo(p.x, p.y);
	ctx.closePath();
}

function starburst(
	ctx: CanvasRenderingContext2D,
	c: Point,
	radius: number,
	spikes: number,
	turn: number,
	seed: number[],
) {
	ctx.beginPath();
	for (let i = 0; i < spikes * 2; i++) {
		const r = i % 2 ? radius * 0.55 : radius * seed[i / 2];
		const a = turn + (i / (spikes * 2)) * Math.PI * 2;
		const x = c.x + Math.cos(a) * r;
		const y = c.y + Math.sin(a) * r;
		if (i) ctx.lineTo(x, y);
		else ctx.moveTo(x, y);
	}
	ctx.closePath();
}

const easeOutBack = (x: number) => 1 + 2.4 * (x - 1) ** 3 + 1.4 * (x - 1) ** 2;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * Draws one cartoon bolt at `age` ms: it shoots out over `shoot`, boils until `hold`,
 * then zips away toward its tip over `zip` while thinning out.
 */
function drawBolt(
	ctx: CanvasRenderingContext2D,
	parts: Zigzag[],
	age: number,
	shoot: number,
	hold: number,
	zip: number,
	ink: number,
) {
	if (age < 0 || age > hold + zip) return;
	const head = clamp01(age / shoot);
	const tail = clamp01((age - hold) / zip) ** 2;
	const thin = 1 - tail * 0.6;
	const frameIndex = Math.floor(age / BOIL_FRAME) % 3;
	for (const part of parts) {
		const wobble = part.boil[frameIndex];
		const points = slice(
			part.spine.map((p, i) => ({ x: p.x + wobble[i].x, y: p.y + wobble[i].y })),
			tail,
			Math.max(tail + 0.001, 1 - (1 - head) ** 3),
		);
		trace(ctx, points);
		ctx.lineWidth = part.width * 3.2 * thin;
		ctx.strokeStyle = GLOW;
		ctx.stroke();
		ribbon(ctx, points, part.width * thin);
		ctx.fillStyle = FILL;
		ctx.fill();
		ctx.lineWidth = ink;
		ctx.strokeStyle = INK;
		ctx.stroke();
		ribbon(ctx, points, part.width * 0.32 * thin);
		ctx.fillStyle = SHINE;
		ctx.fill();
	}
}

function trace(ctx: CanvasRenderingContext2D, points: Point[]) {
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
}

/** Fixed, click-through canvas covering the viewport, scaled for the device pixel ratio. */
function overlay() {
	const canvas = document.createElement("canvas");
	canvas.setAttribute("aria-hidden", "true");
	canvas.style.cssText =
		"position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	document.body.append(canvas);
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const w = window.innerWidth;
	const h = window.innerHeight;
	canvas.width = Math.round(w * dpr);
	canvas.height = Math.round(h * dpr);
	ctx.scale(dpr, dpr);
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	return { canvas, ctx, w, h };
}

/** Escalating cartoon static around the avatar, hinting that more taps do something. */
const CRACKLES = [
	{ arcs: 1, length: 24, width: 5, hold: 200 },
	{ arcs: 3, length: 40, width: 7, hold: 260 },
	{ arcs: 5, length: 64, width: 9, hold: 340 },
];
const CRACKLE_SHOOT = 60;
const CRACKLE_ZIP = 160;

/** `level` is 1–3; each one throws more, longer and thicker zigzags off the avatar's edge. */
export function crackle(origin: Point, edge: number, level: 1 | 2 | 3) {
	if (running || typeof document === "undefined") return;
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const layer = overlay();
	if (!layer) return;
	const { canvas, ctx, w, h } = layer;
	const { arcs, length, width, hold } = CRACKLES[level - 1];

	const turn = Math.random() * Math.PI * 2;
	const at = (angle: number, r: number) => ({
		x: origin.x + Math.cos(angle) * r,
		y: origin.y + Math.sin(angle) * r,
	});
	const bolt = Array.from({ length: arcs }, (_, i) => {
		const angle = turn + (i / arcs) * Math.PI * 2 + random(-0.4, 0.4);
		const out = angle + random(-0.25, 0.25);
		const from = at(angle, edge);
		const reachOut = length * random(0.8, 1.2);
		return zigzag(
			from,
			{ x: from.x + Math.cos(out) * reachOut, y: from.y + Math.sin(out) * reachOut },
			width,
		);
	});
	const life = hold + CRACKLE_ZIP;
	const start = performance.now();

	function frame(now: number) {
		const t = now - start;
		ctx.clearRect(0, 0, w, h);
		drawBolt(ctx, bolt, t, CRACKLE_SHOOT, hold, CRACKLE_ZIP, 2);
		if (t < life && canvas.isConnected) requestAnimationFrame(frame);
		else canvas.remove();
	}

	requestAnimationFrame(frame);
}

/**
 * Full-viewport cartoon lightning that bursts from `origin` (viewport coordinates):
 * a comic starburst, three waves of outlined zigzag bolts that wobble on twos,
 * then the bolts zip away into puffs of smoke.
 */
export function strike(origin: Point) {
	if (running || typeof document === "undefined") return;
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const layer = overlay();
	if (!layer) return;
	const { canvas, ctx, w, h } = layer;
	running = true;

	const dark = document.documentElement.classList.contains("dark");
	const veilPeak = dark ? 0.4 : 0.55;
	const ringReach = Math.hypot(Math.max(origin.x, w - origin.x), Math.max(origin.y, h - origin.y));
	const burstSeeds = Array.from({ length: 3 }, () =>
		Array.from({ length: 14 }, () => random(0.8, 1.15)),
	);

	const bolts: Bolt[] = [];
	const puffs: Puff[] = [];
	const spawned = new Set<number>();
	const start = performance.now();

	function spawn(wave: number, now: number) {
		const { count } = WAVES[wave];
		const turn = Math.random() * Math.PI * 2;
		for (let i = 0; i < count; i++) {
			const angle = turn + (i / count) * Math.PI * 2 + random(-0.3, 0.3);
			bolts.push(makeBolt(origin, angle, now, w, h));
		}
		if (wave === WAVES.length - 1) {
			for (let i = 0; i < 9; i++) {
				const a = (i / 9) * Math.PI * 2 + random(-0.2, 0.2);
				puffs.push({
					x: origin.x + Math.cos(a) * 20,
					y: origin.y + Math.sin(a) * 20,
					vx: Math.cos(a) * random(40, 80),
					vy: Math.sin(a) * random(40, 80) - 20,
					born: now + 150 + random(0, 120),
					life: random(900, 1300),
					size: random(14, 24),
				});
			}
		}
	}

	function frame(now: number) {
		const t = now - start;
		WAVES.forEach((wave, i) => {
			if (t >= wave.at && !spawned.has(i)) {
				spawned.add(i);
				spawn(i, now);
			}
		});

		ctx.clearRect(0, 0, w, h);
		ctx.globalCompositeOperation = "source-over";

		// Each strike floods the page with light, then the darkening veil takes over again
		// so the blue still reads on the light theme.
		const flash = Math.min(
			1,
			WAVES.reduce(
				(sum, wave) =>
					t < wave.at ? sum : sum + wave.flash * Math.exp(-(t - wave.at) / FLASH_DECAY),
				0,
			),
		);
		const veil = veilPeak * clamp01(t / 60) * (t < 1200 ? 1 : clamp01(1 - (t - 1200) / 1100));
		ctx.fillStyle = `rgba(6, 12, 40, ${veil * (1 - flash)})`;
		ctx.fillRect(0, 0, w, h);
		if (flash > 0.01) {
			ctx.fillStyle = `rgba(235, 244, 255, ${flash})`;
			ctx.fillRect(0, 0, w, h);
		}

		// Shockwave rings.
		for (const delay of [0, 160]) {
			const ring = clamp01((t - delay) / 900);
			if (ring <= 0 || ring >= 1) continue;
			const eased = 1 - (1 - ring) ** 3;
			ctx.beginPath();
			ctx.arc(origin.x, origin.y, eased * ringReach, 0, Math.PI * 2);
			ctx.lineWidth = 10 * (1 - ring);
			ctx.strokeStyle = `rgba(150, 200, 255, ${0.8 * (1 - ring)})`;
			ctx.stroke();
		}

		const tick = Math.floor(t / BOIL_FRAME);

		for (const bolt of bolts) {
			const age = now - bolt.born;
			if (age > HOLD + ZIP) continue;
			drawBolt(ctx, bolt.parts, age, SHOOT, HOLD, ZIP, 3);
		}

		// Comic starburst at the avatar: pops in, wobbles, then shrinks away.
		const pop = t < 140 ? easeOutBack(t / 140) : t < 520 ? 1 : 1 - clamp01((t - 520) / 260) ** 2;
		if (pop > 0.01) {
			const seed = burstSeeds[tick % 3];
			const turn = t * 0.0006;
			starburst(ctx, origin, 88 * pop, 14, turn, seed);
			ctx.fillStyle = FILL;
			ctx.fill();
			ctx.lineWidth = 4;
			ctx.strokeStyle = INK;
			ctx.stroke();
			starburst(ctx, origin, 50 * pop, 14, turn + 0.2, seed);
			ctx.fillStyle = SHINE;
			ctx.fill();
		}

		for (const puff of puffs) {
			const age = now - puff.born;
			if (age < 0 || age > puff.life) continue;
			const p = age / puff.life;
			const seconds = age / 1000;
			const x = puff.x + puff.vx * seconds;
			const y = puff.y + puff.vy * seconds;
			const r = puff.size * (0.4 + easeOutBack(clamp01(p * 3)) * 0.6) * (1 - p * 0.5);
			ctx.globalAlpha = 1 - p;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.arc(x + r * 0.7, y + r * 0.2, r * 0.7, 0, Math.PI * 2);
			ctx.arc(x - r * 0.6, y + r * 0.3, r * 0.6, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(200, 222, 255, 0.85)";
			ctx.fill();
			ctx.globalAlpha = 1;
		}

		if (t < DURATION && canvas.isConnected) {
			requestAnimationFrame(frame);
		} else {
			canvas.remove();
			running = false;
		}
	}

	requestAnimationFrame(frame);
}
