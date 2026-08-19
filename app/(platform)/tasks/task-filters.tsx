"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { ListBox, Select } from "@heroui/react";
import { IconSearch } from "@tabler/icons-react";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/text-field";
import lioLogo from "@/public/lio-logo-small-no-text.webp";
import { cn } from "@/components/cn";

import {
  decorateOriginTree,
  emptyTaskFilters,
  taskFiltersAreActive,
  type OriginNode,
  type TaskFilterSelection,
  type YearNode,
} from "./origin-filter";
import { TaskFilterOlympiad } from "@/types/task";

export { emptyTaskFilters, taskFiltersAreActive };
export type { TaskFilterSelection };

const ALL_YEARS_KEY = "all";

function selectedCount(origins: OriginNode[], value: TaskFilterSelection): number {
  if (!value.originId) {
    return origins.reduce((sum, item) => sum + item.count, 0);
  }
  const originNode = origins.find((item) => item.id === value.originId);
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
  olympiads: TaskFilterOlympiad[];
  searchResetKey: number;
  initialQuery: string;
  queryActive: boolean;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  showTitle?: boolean;
};

export function TaskFilters({
  value,
  onChange,
  olympiads,
  searchResetKey,
  initialQuery,
  queryActive,
  onQueryChange,
  onClear,
  showTitle = true,
}: TaskFiltersProps) {
  const origins = decorateOriginTree(olympiads);
  const [searchActive, setSearchActive] = useState(() => initialQuery.trim() !== "");
  const selectedOrigin = origins.find((item) => item.id === value.originId);
  const selectedYear = selectedOrigin?.years.find((item) => item.id === value.yearId);
  const selectedStage = selectedYear?.stages.find((item) => item.id === value.stageId);
  const count = selectedCount(origins, value);
  const canClear = searchActive || queryActive || value.originId != null;

  const selectOrigin = (originId: string) => {
    onChange(
      value.originId === originId
        ? emptyTaskFilters
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
            onClick={() => {
              setSearchActive(false);
              onClear();
            }}
          >
            Notīrīt
          </Button>
        </div>

        <TaskSearchField
          key={searchResetKey}
          initialQuery={initialQuery}
          onActiveChange={setSearchActive}
          onDebouncedChange={onQueryChange}
        />
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain">
        <FilterSection title="Olimpiāde">
        {origins.map((item) => (
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

function TaskSearchField({
  initialQuery,
  onActiveChange,
  onDebouncedChange,
}: {
  initialQuery: string;
  onActiveChange: (active: boolean) => void;
  onDebouncedChange: (query: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onDebouncedChange(query);
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [query, onDebouncedChange]);

  return (
    <TextField
      name="task-search"
      placeholder="Nosaukums, apraksts"
      value={query}
      aria-label="Meklēt uzdevumus"
      onChange={(next) => {
        setQuery(next);
        const nextActive = next.trim() !== "";
        const prevActive = query.trim() !== "";
        if (nextActive !== prevActive) {
          onActiveChange(nextActive);
        }
      }}
      startContent={<IconSearch size={16} aria-hidden />}
    />
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
        {description && description !== label && (
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
