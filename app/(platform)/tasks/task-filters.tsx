"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";

import lioLogo from "@/public/lio-logo-small-no-text.webp";
import { cn } from "@/components/cn";

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

export function taskFiltersAreActive(value: TaskFilterSelection): boolean {
  return value.originId != null;
}

type AgeGroupId = "junior" | "senior";
type StageId = "school" | "municipal" | "national" | "selection";

type AgeGroupNode = {
  id: AgeGroupId;
  label: string;
  count: number;
};

type StageNode = {
  id: StageId;
  label: string;
  count: number;
  ageGroups: AgeGroupNode[];
};

type YearNode = {
  id: string;
  label: string;
  count: number;
  stages: StageNode[];
};

type OriginNode = {
  id: string;
  label: string;
  fullName: string;
  count: number;
  logo?: "lio";
  years: YearNode[];
};

const AGE_GROUPS: { id: AgeGroupId; label: string }[] = [
  { id: "junior", label: "Jaunākā (8.–10. kl.)" },
  { id: "senior", label: "Vecākā (11.–12. kl.)" },
];

const STAGES: { id: StageId; label: string }[] = [
  { id: "school", label: "Skolas" },
  { id: "municipal", label: "Novada" },
  { id: "national", label: "Valsts" },
  { id: "selection", label: "Atlases" },
];

function ageGroups(counts: Partial<Record<AgeGroupId, number>>): AgeGroupNode[] {
  return AGE_GROUPS.flatMap((group) => {
    const count = counts[group.id] ?? 0;
    return count > 0 ? [{ ...group, count }] : [];
  });
}

function stage(id: StageId, counts: Partial<Record<AgeGroupId, number>>): StageNode {
  const groups = ageGroups(counts);
  return {
    id,
    label: STAGES.find((item) => item.id === id)?.label ?? id,
    count: groups.reduce((sum, group) => sum + group.count, 0),
    ageGroups: groups,
  };
}

function year(id: string, stages: StageNode[], count?: number): YearNode {
  return {
    id,
    label: `${id}.\u00A0g.`,
    count: count ?? stages.reduce((sum, item) => sum + item.count, 0),
    stages,
  };
}

function origin(node: Omit<OriginNode, "count"> & { count?: number }): OriginNode {
  return {
    ...node,
    count: node.count ?? node.years.reduce((sum, item) => sum + item.count, 0),
  };
}

function lioYear(
  id: string,
  opts: { national?: boolean; selection?: boolean } = {},
): YearNode {
  const stages = [
    stage("school", { junior: 2, senior: 2 }),
    stage("municipal", { junior: 2, senior: 2 }),
  ];
  if (opts.national) {
    stages.push(stage("national", { junior: 3, senior: 3 }));
  }
  if (opts.selection) {
    stages.push(stage("selection", { senior: 3 }));
  }
  return year(id, stages);
}

/** Placeholder catalog. Options and counts are not loaded from the API. */
const MOCK_ORIGINS: OriginNode[] = [
  origin({
    id: "LIO",
    label: "LIO",
    fullName: "Latvijas informātikas olimpiāde",
    logo: "lio",
    years: [
      lioYear("2026", { national: true }),
      lioYear("2025", { national: true, selection: true }),
      lioYear("2024", { national: true, selection: true }),
      lioYear("2023", { national: true, selection: true }),
      lioYear("2022", { national: true }),
      lioYear("2021", { national: true }),
      lioYear("2020", { national: true }),
      lioYear("2019", { national: true }),
    ],
  }),
  origin({
    id: "BOI",
    label: "BOI",
    fullName: "Baltijas informātikas olimpiāde",
    years: [year("2026", [], 6), year("2025", [], 6), year("2024", [], 6)],
  }),
  origin({
    id: "IOI",
    label: "IOI",
    fullName: "Starptautiskā informātikas olimpiāde",
    years: [year("2025", [], 6), year("2024", [], 6), year("2023", [], 6)],
  }),
  origin({
    id: "other",
    label: "Citi",
    fullName: "Uzdevumi bez olimpiādes izcelsmes",
    years: [],
    count: 8,
  }),
];

function selectedCount(value: TaskFilterSelection): number {
  if (!value.originId) {
    return MOCK_ORIGINS.reduce((sum, item) => sum + item.count, 0);
  }
  const originNode = MOCK_ORIGINS.find((item) => item.id === value.originId);
  if (!originNode) {
    return 0;
  }
  if (!value.yearId) {
    return originNode.count;
  }
  const yearNode = originNode.years.find((item) => item.id === value.yearId);
  if (!yearNode) {
    return 0;
  }
  if (!value.stageId) {
    return yearNode.count;
  }
  const stageNode = yearNode.stages.find((item) => item.id === value.stageId);
  if (!stageNode) {
    return 0;
  }
  if (!value.ageGroupId) {
    return stageNode.count;
  }
  return stageNode.ageGroups.find((item) => item.id === value.ageGroupId)?.count ?? 0;
}

function uzdevumiLabel(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} uzdevums`;
  }
  return `${count} uzdevumi`;
}

type TaskFiltersProps = {
  value: TaskFilterSelection;
  onChange: (next: TaskFilterSelection) => void;
  showTitle?: boolean;
};

export function TaskFilters({ value, onChange, showTitle = true }: TaskFiltersProps) {
  const selectedOrigin = MOCK_ORIGINS.find((item) => item.id === value.originId);
  const selectedYear = selectedOrigin?.years.find((item) => item.id === value.yearId);
  const selectedStage = selectedYear?.stages.find((item) => item.id === value.stageId);
  const count = selectedCount(value);
  const canClear = taskFiltersAreActive(value);

  const selectOrigin = (originId: string) => {
    onChange(
      value.originId === originId
        ? emptyTaskFilters
        : { originId, yearId: null, stageId: null, ageGroupId: null },
    );
  };

  const selectYear = (yearId: string) => {
    onChange({
      ...value,
      yearId: value.yearId === yearId ? null : yearId,
      stageId: null,
      ageGroupId: null,
    });
  };

  const selectStage = (stageId: string) => {
    onChange({
      ...value,
      stageId: value.stageId === stageId ? null : stageId,
      ageGroupId: null,
    });
  };

  const selectAgeGroup = (ageGroupId: string) => {
    onChange({
      ...value,
      ageGroupId: value.ageGroupId === ageGroupId ? null : ageGroupId,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2 px-1">
        <div>
          {showTitle && (
            <h2 className="text-sm font-medium text-default-800">Filtri</h2>
          )}
          <p className={cn("text-xs text-gray-500", showTitle && "mt-0.5")}>
            {uzdevumiLabel(count)}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          isDisabled={!canClear}
          className="h-7 min-h-7 px-2 text-xs text-default-600"
          onPress={() => onChange(emptyTaskFilters)}
        >
          Notīrīt
        </Button>
      </div>

      <FilterSection title="Olimpiāde">
        {MOCK_ORIGINS.map((item) => (
          <FilterOption
            key={item.id}
            selected={value.originId === item.id}
            label={item.label}
            description={item.fullName}
            count={item.count}
            leading={item.logo === "lio" ? <LioLogo /> : <OriginMark label={item.label} />}
            onSelect={() => selectOrigin(item.id)}
          />
        ))}
      </FilterSection>

      {selectedOrigin && selectedOrigin.years.length > 0 && (
        <FilterSection title="Gads">
          {selectedOrigin.years.map((item) => (
            <FilterOption
              key={item.id}
              selected={value.yearId === item.id}
              label={item.label}
              count={item.count}
              onSelect={() => selectYear(item.id)}
            />
          ))}
        </FilterSection>
      )}

      {selectedYear && selectedYear.stages.length > 0 && (
        <FilterSection title="Kārta">
          {selectedYear.stages.map((item) => (
            <FilterOption
              key={item.id}
              selected={value.stageId === item.id}
              label={item.label}
              count={item.count}
              onSelect={() => selectStage(item.id)}
            />
          ))}
        </FilterSection>
      )}

      {selectedStage && selectedStage.ageGroups.length > 0 && (
        <FilterSection title="Vecuma grupa">
          {selectedStage.ageGroups.map((item) => (
            <FilterOption
              key={item.id}
              selected={value.ageGroupId === item.id}
              label={item.label}
              count={item.count}
              onSelect={() => selectAgeGroup(item.id)}
            />
          ))}
        </FilterSection>
      )}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1">
      <h3 className="px-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      <div role="radiogroup" aria-label={title} className="flex flex-col">
        {children}
      </div>
    </section>
  );
}

function FilterOption({
  selected,
  label,
  description,
  count,
  leading,
  onSelect,
}: {
  selected: boolean;
  label: string;
  description?: string;
  count: number;
  leading?: ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm border-l-2 px-2 py-1.5 text-left",
        selected
          ? "border-l-zinc-800 bg-zinc-100"
          : "border-l-transparent hover:bg-zinc-50",
      )}
    >
      {leading}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm",
            selected ? "font-medium text-default-900" : "text-default-800",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="block truncate text-xs text-gray-500">{description}</span>
        )}
      </span>
      <span className="shrink-0 tabular-nums text-xs text-gray-500">{count}</span>
    </button>
  );
}

function LioLogo() {
  const height = 22;
  const width = Math.round(height * (9 / 10));
  return (
    <Image
      alt=""
      src={lioLogo}
      width={width}
      height={height}
      className="h-[22px] w-auto shrink-0"
    />
  );
}

function OriginMark({ label }: { label: string }) {
  return (
    <span
      aria-hidden
      className="flex h-[22px] w-[20px] shrink-0 items-center justify-center rounded-sm bg-zinc-100 text-[9px] font-medium text-default-600"
    >
      {label.slice(0, 2)}
    </span>
  );
}
