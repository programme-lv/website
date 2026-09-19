import { TaskFilterOlympiad, TaskPreview } from "@/types/task";

export type TaskFilterSelection = {
  originId: string | null;
  yearId: string | null;
  stageId: string | null;
  ageGroupId: string | null;
};

export const emptyTaskFilters: TaskFilterSelection = {
  originId: null,
  yearId: null,
  stageId: null,
  ageGroupId: null,
};

export const TASK_LIST_SEARCH_KEYS = {
  query: "q",
  origin: "origin",
  year: "year",
  stage: "stage",
  age: "age",
} as const;

type SearchParamValue = string | string[] | undefined;
type SearchParamGetter = { get(name: string): string | null };
type SearchParamInput =
  | SearchParamGetter
  | Readonly<Record<string, SearchParamValue>>;

function firstSearchParam(value: SearchParamValue | null): string | null {
  if (value == null) {
    return null;
  }
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw.trim();
  return trimmed === "" ? null : trimmed;
}

function readSearchParam(input: SearchParamInput, key: string): string | null {
  if ("get" in input && typeof input.get === "function") {
    return firstSearchParam(input.get(key));
  }
  return firstSearchParam(input[key]);
}

export function parseTaskListSearchParams(input: SearchParamInput): {
  filters: TaskFilterSelection;
  query: string;
} {
  const originId = readSearchParam(input, TASK_LIST_SEARCH_KEYS.origin);
  return {
    query: readSearchParam(input, TASK_LIST_SEARCH_KEYS.query) ?? "",
    filters: {
      originId,
      yearId: originId ? readSearchParam(input, TASK_LIST_SEARCH_KEYS.year) : null,
      stageId: originId ? readSearchParam(input, TASK_LIST_SEARCH_KEYS.stage) : null,
      ageGroupId: originId ? readSearchParam(input, TASK_LIST_SEARCH_KEYS.age) : null,
    },
  };
}

export function taskListSearchHref(
  pathname: string,
  filters: TaskFilterSelection,
  query: string,
): string {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();
  if (trimmedQuery !== "") {
    params.set(TASK_LIST_SEARCH_KEYS.query, trimmedQuery);
  }
  if (filters.originId) {
    params.set(TASK_LIST_SEARCH_KEYS.origin, filters.originId);
    if (filters.yearId) {
      params.set(TASK_LIST_SEARCH_KEYS.year, filters.yearId);
    }
    if (filters.stageId) {
      params.set(TASK_LIST_SEARCH_KEYS.stage, filters.stageId);
    }
    if (filters.ageGroupId) {
      params.set(TASK_LIST_SEARCH_KEYS.age, filters.ageGroupId);
    }
  }
  const qs = params.toString();
  return qs === "" ? pathname : `${pathname}?${qs}`;
}

export function taskFiltersAreActive(value: TaskFilterSelection): boolean {
  return value.originId != null;
}

const OLYMPIAD_NAMES: Record<string, string> = {
  LIO: "Latvijas informātikas olimpiāde",
  BOI: "Baltijas informātikas olimpiāde",
  IOI: "Starptautiskā informātikas olimpiāde",
  other: "Uzdevumi bez olimpiādes izcelsmes",
};

const STAGE_LABELS: Record<string, string> = {
  school: "Skolas",
  municipal: "Novada",
  national: "Valsts",
  selection: "Atlases",
};

const AGE_GROUP_LABELS: Record<string, { label: string; description?: string }> = {
  junior: { label: "Jaunākā (8.–10. kl.)" },
  senior: { label: "Vecākā (11.–12. kl.)" },
  both: { label: "Abas", description: "Jaunākā un vecākā" },
};

export type AgeGroupNode = {
  id: string;
  label: string;
  description?: string;
  count: number;
};

export type StageNode = {
  id: string;
  label: string;
  count: number;
  ageGroups: AgeGroupNode[];
};

export type YearNode = {
  id: string;
  label: string;
  count: number;
  stages: StageNode[];
};

export type OriginNode = {
  id: string;
  label: string;
  fullName: string;
  count: number;
  logo?: "lio";
  years: YearNode[];
};

export function normalizeOlympiad(raw?: string): string {
  const value = (raw ?? "").trim();
  return value === "" ? "other" : value;
}

export function normalizeYear(raw?: string): string {
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

export function divisionKind(divisions?: string[]): string {
  const junior = (divisions ?? []).includes("junior");
  const senior = (divisions ?? []).includes("senior");
  if (junior && senior && (divisions ?? []).length === 2) {
    return "both";
  }
  if (junior && (divisions ?? []).length === 1) {
    return "junior";
  }
  if (senior && (divisions ?? []).length === 1) {
    return "senior";
  }
  return "";
}

export function decorateOriginTree(olympiads: TaskFilterOlympiad[]): OriginNode[] {
  return olympiads.map((olympiad) => ({
    id: olympiad.id,
    label: olympiad.id === "other" ? "Citi" : olympiad.id,
    fullName: OLYMPIAD_NAMES[olympiad.id] ?? "",
    count: olympiad.count,
    logo: olympiad.id === "LIO" ? "lio" : undefined,
    years: olympiad.years.map((year) => ({
      id: year.id,
      label: `${year.id}.\u00A0g.`,
      count: year.count,
      stages: year.stages.map((stage) => ({
        id: stage.id,
        label: STAGE_LABELS[stage.id] ?? stage.id,
        count: stage.count,
        ageGroups: stage.divisions.map((division) => ({
          id: division.id,
          count: division.count,
          label: AGE_GROUP_LABELS[division.id]?.label ?? division.id,
          description: AGE_GROUP_LABELS[division.id]?.description,
        })),
      })),
    })),
  }));
}

export function taskMatchesFilters(
  task: TaskPreview,
  filters: TaskFilterSelection,
  query: string,
): boolean {
  const olympiad = normalizeOlympiad(task.origin_olympiad);
  if (filters.originId != null && olympiad !== filters.originId) {
    return false;
  }
  const year = normalizeYear(task.origin_year);
  if (filters.yearId != null && year !== filters.yearId) {
    return false;
  }
  if (filters.stageId != null && (task.olymp_stage ?? "") !== filters.stageId) {
    return false;
  }
  if (filters.ageGroupId != null && divisionKind(task.origin_divisions) !== filters.ageGroupId) {
    return false;
  }
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  const haystack = [
    task.full_name,
    task.origin_note,
    task.origin_note_short,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}
