"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ListBox, Select } from "@heroui/react";
import { IconSearch } from "@tabler/icons-react";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/text-field";
import lioLogo from "@/public/lio-logo-small-no-text.webp";
import { cn } from "@/components/cn";

export type TaskFilterSelection = {
  query: string;
  originId: string | null;
  yearId: string | null;
  stageId: string | null;
  ageGroupId: string | null;
};

export const emptyTaskFilters: TaskFilterSelection = {
  query: "",
  originId: null,
  yearId: null,
  stageId: null,
  ageGroupId: null,
};

export function taskFiltersAreActive(value: TaskFilterSelection): boolean {
  return (value.query ?? "").trim() !== "" || value.originId != null;
}

type AgeGroupId = "junior" | "senior" | "both";
type StageId = "school" | "municipal" | "national" | "selection";

type AgeGroupNode = {
  id: AgeGroupId;
  label: string;
  description?: string;
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

const AGE_GROUPS: {
  id: AgeGroupId;
  label: string;
  description?: string;
}[] = [
  { id: "junior", label: "Jaunākā (8.–10. kl.)" },
  { id: "senior", label: "Vecākā (11.–12. kl.)" },
  { id: "both", label: "Abas", description: "Jaunākā un vecākā" },
];

const STAGES: { id: StageId; label: string }[] = [
  { id: "school", label: "Skolas" },
  { id: "municipal", label: "Novada" },
  { id: "national", label: "Valsts" },
  { id: "selection", label: "Atlases" },
];

const ALL_YEARS_KEY = "all";

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
  opts: { national?: boolean; selection?: boolean; both?: boolean } = {},
): YearNode {
  const schoolCounts: Partial<Record<AgeGroupId, number>> = opts.both
    ? { junior: 2, senior: 2, both: 1 }
    : { junior: 2, senior: 2 };
  const nationalCounts: Partial<Record<AgeGroupId, number>> = opts.both
    ? { junior: 3, senior: 3, both: 1 }
    : { junior: 3, senior: 3 };
  const stages = [
    stage("school", schoolCounts),
    stage("municipal", { junior: 2, senior: 2 }),
  ];
  if (opts.national) {
    stages.push(stage("national", nationalCounts));
  }
  if (opts.selection) {
    stages.push(stage("selection", { senior: 3 }));
  }
  return year(id, stages);
}

function lioYears(): YearNode[] {
  const years: YearNode[] = [];
  for (let y = 2026; y >= 1988; y -= 1) {
    years.push(
      lioYear(String(y), {
        national: true,
        selection: y >= 2005 && y !== 2026,
        both: y >= 2016,
      }),
    );
  }
  return years;
}

/** Placeholder catalog. Options and counts are not loaded from the API. */
const MOCK_ORIGINS: OriginNode[] = [
  origin({
    id: "LIO",
    label: "LIO",
    fullName: "Latvijas informātikas olimpiāde",
    logo: "lio",
    years: lioYears(),
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
        ? { ...emptyTaskFilters, query: value.query }
        : { ...value, originId, yearId: null, stageId: null, ageGroupId: null },
    );
  };

  const selectYear = (yearId: string | null) => {
    onChange({
      ...value,
      yearId,
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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="sticky top-0 z-10 shrink-0 space-y-4 bg-white pb-3">
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
            onClick={() => onChange(emptyTaskFilters)}
          >
            Notīrīt
          </Button>
        </div>

        <TextField
          name="task-search"
          placeholder="Meklēt"
          value={value.query ?? ""}
          aria-label="Meklēt uzdevumus"
          onChange={(query) => onChange({ ...value, query })}
          startContent={<IconSearch size={16} aria-hidden />}
        />
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain">
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
        <FilterField title="Gads">
          <YearSelect
            years={selectedOrigin.years}
            selectedYearId={value.yearId}
            onSelect={selectYear}
          />
        </FilterField>
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
              description={item.description}
              count={item.count}
              onSelect={() => selectAgeGroup(item.id)}
            />
          ))}
        </FilterSection>
      )}
      </div>
    </div>
  );
}

function YearSelect({
  years,
  selectedYearId,
  onSelect,
}: {
  years: YearNode[];
  selectedYearId: string | null;
  onSelect: (yearId: string | null) => void;
}) {
  return (
    <Select
      className="w-full"
      variant="secondary"
      selectedKey={selectedYearId ?? ALL_YEARS_KEY}
      onSelectionChange={(key) => {
        if (key == null || key === ALL_YEARS_KEY) {
          onSelect(null);
          return;
        }
        onSelect(String(key));
      }}
    >
      <Select.Trigger
        className="h-8 min-h-8 w-full justify-between gap-2 rounded-sm px-3 text-sm font-normal"
      >
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="overflow-hidden rounded-sm">
        <ListBox className="max-h-72 overflow-y-auto rounded-sm">
          <ListBox.Item id={ALL_YEARS_KEY} textValue="Visi gadi">
            Visi gadi
          </ListBox.Item>
          {years.map((item) => (
            <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
              {item.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

function FilterField({
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
      {children}
    </section>
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
