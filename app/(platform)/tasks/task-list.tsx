"use client";

import React, {
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Modal, cn } from "@heroui/react";
import { IconFilter } from "@tabler/icons-react";

import Alert from "@/components/alert";
import Button from "@/components/ui/button";
import { listTaskFilters, listTasks } from "@/lib/task/tasks";
import TaskCard from "@/components/task-list-card";
import { TaskFilterTree, TaskPreview } from "@/types/task";
import { AuthContext } from "@/app/providers";
import { getMaxScorePerTask } from "@/lib/subms";
import { MaxScorePerTask } from "@/types/scores";

import {
  emptyTaskFilters,
  TaskFilters,
  taskFiltersAreActive,
  TaskFilterSelection,
} from "./task-filters";
import {
  parseTaskListSearchParams,
  taskListSearchHref,
  taskMatchesFilters,
} from "./origin-filter";

type TaskListProps = {
  tasks: TaskPreview[];
  filterTree?: TaskFilterTree;
  userMaxScores?: MaxScorePerTask;
  initialFilters?: TaskFilterSelection;
  initialQuery?: string;
};

export function TaskList(props: TaskListProps) {
  return (
    <Suspense
      fallback={
        <TaskListView
          {...props}
          filters={props.initialFilters ?? emptyTaskFilters}
          query={props.initialQuery ?? ""}
        />
      }
    >
      <TaskListFromUrl {...props} />
    </Suspense>
  );
}

function TaskListFromUrl(props: TaskListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, query } = useMemo(
    () => parseTaskListSearchParams(searchParams),
    [searchParams],
  );
  const filtersRef = useRef(filters);
  const queryRef = useRef(query);
  filtersRef.current = filters;
  queryRef.current = query;

  const replaceSearch = useCallback(
    (nextFilters: TaskFilterSelection, nextQuery: string) => {
      window.history.replaceState(
        null,
        "",
        taskListSearchHref(pathname, nextFilters, nextQuery),
      );
    },
    [pathname],
  );

  const onFiltersChange = useCallback(
    (next: TaskFilterSelection) => {
      replaceSearch(next, queryRef.current);
    },
    [replaceSearch],
  );
  const onQueryChange = useCallback(
    (next: string) => {
      replaceSearch(filtersRef.current, next);
    },
    [replaceSearch],
  );
  const onClearFilters = useCallback(() => {
    replaceSearch(emptyTaskFilters, "");
  }, [replaceSearch]);

  return (
    <TaskListView
      {...props}
      filters={filters}
      query={query}
      onFiltersChange={onFiltersChange}
      onQueryChange={onQueryChange}
      onClearFilters={onClearFilters}
    />
  );
}

function TaskListView({
  tasks: initialTasks,
  filterTree,
  userMaxScores: initialUserMaxScores,
  filters,
  query,
  onFiltersChange,
  onQueryChange,
  onClearFilters,
}: TaskListProps & {
  filters: TaskFilterSelection;
  query: string;
  onFiltersChange?: (next: TaskFilterSelection) => void;
  onQueryChange?: (next: string) => void;
  onClearFilters?: () => void;
}) {
  const authContext = useContext(AuthContext);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersActive = taskFiltersAreActive(filters) || query.trim() !== "";

  const userMaxScoresQuery = useQuery({
    queryKey: ["userScores", authContext.user?.username],
    queryFn: () => getMaxScorePerTask(authContext.user?.username ?? ""),
    enabled: !initialUserMaxScores && !!authContext.user?.username,
  });
  const listTasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: listTasks,
  });
  const filterTreeQuery = useQuery({
    queryKey: ["task-filters"],
    queryFn: listTaskFilters,
    initialData: filterTree
      ? { status: "success" as const, data: filterTree }
      : undefined,
  });

  const olympiads = filterTreeQuery.data?.status === "success"
    ? (filterTreeQuery.data.data?.olympiads ?? [])
    : [];

  const tasks = useMemo(() => {
    const list = listTasksQuery.data?.status === "success"
      ? (listTasksQuery.data.data ?? [])
      : initialTasks;
    return [...list].sort(
      (a, b) => a.difficulty_rating - b.difficulty_rating,
    );
  }, [listTasksQuery.data, initialTasks]);
  const visibleTasks = useMemo(
    () => tasks.filter((task) => taskMatchesFilters(task, filters, query)),
    [tasks, filters, query],
  );

  const handleClear = useCallback(() => {
    setSearchResetKey((key) => key + 1);
    onClearFilters?.();
  }, [onClearFilters]);

  let userMaxScores = initialUserMaxScores ?? userMaxScoresQuery.data;

  if (listTasksQuery.error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  return (
    <div className="mt-3 w-full overflow-visible">
      <div className="flex items-stretch gap-3 lg:gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex justify-end lg:hidden">
            <Button
              size="sm"
              variant="default"
              icon={<IconFilter size={16} aria-hidden />}
              iconPosition="start"
              className={cn(filtersActive && "text-[#0f62fe]")}
              onClick={() => setFiltersOpen(true)}
            >
              Filtri
            </Button>
          </div>
          {visibleTasks.length === 0 ? (
            <p className="px-1 text-sm text-gray-500">Nav uzdevumu</p>
          ) : (
            <TaskCardGrid tasks={visibleTasks} userMaxScores={userMaxScores} />
          )}
        </div>
        <aside className="hidden w-[17.5rem] shrink-0 lg:block" aria-label="Filtri">
          <div className="sticky top-3 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-sm border border-zinc-200 bg-white p-3">
            <TaskFilters
              value={filters}
              onChange={onFiltersChange ?? (() => {})}
              olympiads={olympiads}
              searchResetKey={searchResetKey}
              initialQuery={query}
              queryActive={query.trim() !== ""}
              onQueryChange={onQueryChange ?? (() => {})}
              onClear={handleClear}
            />
          </div>
        </aside>
      </div>

      <Modal>
        <Modal.Backdrop
          isOpen={filtersOpen}
          onOpenChange={setFiltersOpen}
          variant="blur"
        >
          <Modal.Container placement="bottom" scroll="inside" size="lg">
            <Modal.Dialog>
              <Modal.Header className="flex flex-row items-center justify-between gap-2 border-b border-divider px-4 py-3">
                <Modal.Heading className="text-base font-semibold">
                  Filtri
                </Modal.Heading>
                <Modal.CloseTrigger aria-label="Aizvērt" />
              </Modal.Header>
              <Modal.Body className="flex max-h-[min(70vh,32rem)] flex-col overflow-hidden px-3 py-4">
                <TaskFilters
                  key={filtersOpen ? `open-${searchResetKey}` : "closed"}
                  showTitle={false}
                  value={filters}
                  onChange={onFiltersChange ?? (() => {})}
                  olympiads={olympiads}
                  searchResetKey={searchResetKey}
                  initialQuery={query}
                  queryActive={query.trim() !== ""}
                  onQueryChange={onQueryChange ?? (() => {})}
                  onClear={handleClear}
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

const TaskCardGrid = React.memo(function TaskCardGrid({
  tasks,
  userMaxScores,
}: {
  tasks: TaskPreview[];
  userMaxScores?: MaxScorePerTask;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {tasks.map((task) => (
        <Link
          key={task.short_id}
          className="contents"
          href={`/tasks/${task.short_id}`}
          prefetch={true}
        >
          {userMaxScores && (
            <TaskCard key={task.short_id} {...task} user_max_score={userMaxScores[task.short_id]}/>
          )}
          {!userMaxScores && (
            <TaskCard key={task.short_id} {...task} />
          )}
        </Link>
      ))}
    </div>
  );
});
