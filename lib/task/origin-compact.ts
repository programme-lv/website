const STAGE_LABELS: Record<string, string> = {
	school: "Skolas",
	municipal: "Novada",
	national: "Valsts",
	selection: "Atlases",
};

export function stageLabel(stageId?: string): string {
	const value = (stageId ?? "").trim();
	if (value === "") {
		return "";
	}
	return STAGE_LABELS[value] ?? value;
}

export function normalizeOriginYear(raw?: string): string {
	const value = (raw ?? "").trim();
	if (value === "") {
		return "";
	}
	const parts = value.split("/");
	const last = Number(parts[parts.length - 1]);
	if (!Number.isInteger(last)) {
		return value;
	}
	if (parts.length === 2) {
		const first = Number(parts[0]);
		if (!Number.isInteger(first) || first + 1 !== last) {
			return value;
		}
	} else if (parts.length !== 1) {
		return value;
	}
	return String(last);
}

export type CompactOrigin = {
	year: string;
	stage: string;
};

type OriginInput = {
	origin_olympiad?: string;
	origin_year?: string;
	olymp_stage?: string;
	origin_note?: string;
	origin_note_short?: string;
};

const LEGACY_ORIGIN =
	/\b((?:19|20)\d{2})\.\s*g\.[^.]*?\bLIO\b[^.]*?\b(skolas|novada|valsts|atlases)\b/i;

// Keep this LIO-only and require both a four-digit year and a known stage.
// Older previews have no structured origin fields but a consistent short note.
export function compactLioOrigin(input: OriginInput): CompactOrigin | null {
	if ((input.origin_olympiad ?? "").trim() !== "LIO") {
		return null;
	}

	const year = normalizeOriginYear(input.origin_year);
	const knownStage = STAGE_LABELS[(input.olymp_stage ?? "").trim()];
	if (year !== "" && knownStage) {
		return { year, stage: knownStage.toLowerCase() };
	}

	const note = input.origin_note_short || input.origin_note || "";
	const match = LEGACY_ORIGIN.exec(note);
	if (!match) {
		return null;
	}
	return { year: match[1], stage: match[2].toLowerCase() };
}
