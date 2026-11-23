// Community verdict distribution for a task preview.
//
// The backend sends per-user verdicts, not per-submission results: a user is
// counted as `accepted` when they have ever solved the task, otherwise their
// latest completed submission decides the verdict. The website only derives
// the pie geometry and the accessible summary from those counts.

export const COMMUNITY_VERDICT_ORDER = [
	"accepted",
	"partially_correct",
	"wrong_answer",
	"time_limit_exceeded",
	"memory_limit_exceeded",
	"runtime_error",
	"compile_error",
	"internal_error",
	"tester_unavailable",
	"unknown",
] as const;

export type CommunityVerdictKey = (typeof COMMUNITY_VERDICT_ORDER)[number];

// Mirrors the public API shape. Kept structural so the node test can import
// this module without the Next.js `@/` alias.
export type CommunityStatsInput = {
	unique_solvers?: number;
	unique_attempted?: number;
	verdicts?: Record<string, number>;
};

export type CommunityVerdictSlice = {
	key: CommunityVerdictKey;
	label: string;
	colorClass: string;
	count: number;
	fraction: number;
	path: string | null;
	fullCircle: boolean;
};

export type CommunityStatsView = {
	uniqueSolvers: number;
	uniqueAttempted: number;
	displaySolvers: string;
	displayAttempted: string;
	slices: CommunityVerdictSlice[];
	summary: string;
};

// Existing copy, mirrored from `components/test-details-modal.tsx`
// (`full_verdicts` / `verdict_colors`) and
// `components/submission-table.tsx` (`statusTranslations`). Importing those
// client modules here would pull React and the submission table into a pure
// node-tested helper.
const VERDICT_META: Record<
	CommunityVerdictKey,
	{ label: string; colorClass: string }
> = {
	accepted: { label: "Atbilde ir pareiza", colorClass: "text-subm-success" },
	partially_correct: { label: "Daļēji pareizi", colorClass: "text-subm-warning" },
	wrong_answer: { label: "Nepareiza atbilde", colorClass: "text-subm-danger" },
	time_limit_exceeded: { label: "Pārsniegts laiks", colorClass: "text-subm-warning" },
	memory_limit_exceeded: { label: "Pārsniegta atmiņa", colorClass: "text-subm-warning" },
	runtime_error: { label: "Izpildes kļūda", colorClass: "text-subm-danger" },
	compile_error: { label: "Kompilācijas kļūda", colorClass: "text-subm-danger" },
	internal_error: { label: "Servera kļūda", colorClass: "text-default-500" },
	tester_unavailable: { label: "Testētājs nav pieejams", colorClass: "text-default-500" },
	unknown: { label: "Nezināms", colorClass: "text-default-500" },
};

const KNOWN_VERDICTS = new Set<string>(COMMUNITY_VERDICT_ORDER);

const DEFAULT_PIE_DIAMETER = 20;

function sanitizeCount(raw: unknown): number {
	if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) {
		return 0;
	}
	const floored = Math.floor(raw);
	return Number.isSafeInteger(floored) ? floored : 0;
}

function normalizeVerdictKey(raw: string): CommunityVerdictKey {
	return KNOWN_VERDICTS.has(raw) ? (raw as CommunityVerdictKey) : "unknown";
}

// Locale-independent grouping with a non-breaking space, so the server and
// client render the same string during hydration.
export function formatCommunityCount(value: number): string {
	const floored =
		typeof value === "number" && Number.isFinite(value)
			? Math.floor(value)
			: 0;
	const safe = Number.isSafeInteger(floored) && floored > 0 ? floored : 0;
	return String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

// Six decimals keep a tiny wedge distinct from its neighbour, and trimming
// trailing zeros keeps the path readable. The result never uses exponent
// notation, which also keeps the test parser straightforward.
function formatCoordinate(value: number): string {
	const normalized = Object.is(value, -0) ? 0 : value;
	const fixed = normalized.toFixed(6).replace(/\.?0+$/, "");
	return fixed === "-0" ? "0" : fixed;
}

function polarPoint(
	cx: number,
	cy: number,
	radius: number,
	fraction: number,
): [string, string] {
	const angle = fraction * Math.PI * 2 - Math.PI / 2;
	return [
		formatCoordinate(cx + radius * Math.cos(angle)),
		formatCoordinate(cy + radius * Math.sin(angle)),
	];
}

function wedgePath(
	diameter: number,
	startFraction: number,
	endFraction: number,
): string {
	const center = diameter / 2;
	const radius = diameter / 2;
	const [x0, y0] = polarPoint(center, center, radius, startFraction);
	const [x1, y1] = polarPoint(center, center, radius, endFraction);
	const fraction = endFraction - startFraction;
	const head = `M ${formatCoordinate(center)} ${formatCoordinate(center)} L ${x0} ${y0}`;
	const arc = (x: string, y: string) =>
		`A ${formatCoordinate(radius)} ${formatCoordinate(radius)} 0 0 1 ${x} ${y}`;

	// A large wedge whose endpoints round to the same point would be omitted
	// by SVG. Split it at the midpoint so both arcs have well-separated
	// endpoints, even when a tiny neighbouring slice is very close to zero.
	if (fraction > 0.5) {
		const midFraction = (startFraction + endFraction) / 2;
		const [xm, ym] = polarPoint(center, center, radius, midFraction);
		return `${head} ${arc(xm, ym)} ${arc(x1, y1)} Z`;
	}

	return `${head} ${arc(x1, y1)} Z`;
}

function buildSlices(
	counts: Map<CommunityVerdictKey, number>,
	total: number,
	diameter: number,
): CommunityVerdictSlice[] {
	const visible = COMMUNITY_VERDICT_ORDER.flatMap((key) => {
		const count = counts.get(key) ?? 0;
		return count > 0 ? [{ key, count }] : [];
	});

	if (visible.length === 0) {
		return [];
	}

	let accumulated = 0;
	return visible.map(({ key, count }, index) => {
		const startFraction = accumulated / total;
		accumulated += count;
		const isLast = index === visible.length - 1;
		// Close the last wedge exactly at 2 pi instead of relying on the float
		// sum of earlier counts.
		const endFraction = isLast ? 1 : accumulated / total;
		const fullCircle = visible.length === 1;
		const meta = VERDICT_META[key];

		return {
			key,
			label: meta.label,
			colorClass: meta.colorClass,
			count,
			fraction: count / total,
			path: fullCircle
				? null
				: wedgePath(diameter, startFraction, endFraction),
			fullCircle,
		};
	});
}

function buildSummary(
	uniqueSolvers: number,
	uniqueAttempted: number,
	slices: CommunityVerdictSlice[],
): string {
	const head = `Atrisinājuši: ${formatCommunityCount(uniqueSolvers)}. Mēģinājuši: ${formatCommunityCount(uniqueAttempted)}`;
	if (slices.length === 0) {
		return head;
	}
	const categories = slices
		.map((slice) => `${slice.label}: ${formatCommunityCount(slice.count)}`)
		.join(". ");
	return `${head}. ${categories}.`;
}

export function buildCommunityStats(
	input: CommunityStatsInput | null | undefined,
): CommunityStatsView | null {
	if (!input) {
		return null;
	}

	const uniqueAttempted = sanitizeCount(input.unique_attempted);
	if (uniqueAttempted === 0) {
		return null;
	}

	const uniqueSolvers = sanitizeCount(input.unique_solvers);
	if (uniqueSolvers > uniqueAttempted) {
		return null;
	}

	const counts = new Map<CommunityVerdictKey, number>();
	for (const [rawKey, rawCount] of Object.entries(input.verdicts ?? {})) {
		const count = sanitizeCount(rawCount);
		if (count === 0) {
			continue;
		}
		const key = normalizeVerdictKey(rawKey);
		const merged = (counts.get(key) ?? 0) + count;
		if (!Number.isSafeInteger(merged)) {
			return null;
		}
		counts.set(key, merged);
	}

	let total = 0;
	for (const count of counts.values()) {
		const next = total + count;
		if (!Number.isSafeInteger(next)) {
			return null;
		}
		total = next;
	}

	// The contract requires the slices to sum to the attempted count and the
	// accepted slice to equal the visible solver count. Hide a contradictory
	// payload instead of rescaling it into a different story.
	if (total === 0 || total !== uniqueAttempted) {
		return null;
	}
	if ((counts.get("accepted") ?? 0) !== uniqueSolvers) {
		return null;
	}

	const slices = buildSlices(counts, total, DEFAULT_PIE_DIAMETER);

	return {
		uniqueSolvers,
		uniqueAttempted,
		displaySolvers: formatCommunityCount(uniqueSolvers),
		displayAttempted: formatCommunityCount(uniqueAttempted),
		slices,
		summary: buildSummary(uniqueSolvers, uniqueAttempted, slices),
	};
}
