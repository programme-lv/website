"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
import { taskMatchesFilters } from "./origin-filter";

export function TaskList(props: {
  tasks: TaskPreview[];
  filterTree?: TaskFilterTree;
  userMaxScores?: MaxScorePerTask;
}) {
  const authContext = useContext(AuthContext);
  const [filters, setFilters] = useState<TaskFilterSelection>(emptyTaskFilters);
  const [query, setQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersActive = taskFiltersAreActive(filters) || query.trim() !== "";

  const userMaxScoresQuery = useQuery({
    queryKey: ["userScores", authContext.user?.username],
    queryFn: () => getMaxScorePerTask(authContext.user?.username ?? ""),
    enabled: !props.userMaxScores && !!authContext.user?.username,
  });
  const listTasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: listTasks,
  });
  const filterTreeQuery = useQuery({
    queryKey: ["task-filters"],
    queryFn: listTaskFilters,
    initialData: props.filterTree
      ? { status: "success" as const, data: props.filterTree }
      : undefined,
  });

  const olympiads = filterTreeQuery.data?.status === "success"
    ? (filterTreeQuery.data.data?.olympiads ?? [])
    : [];

  const tasks = useMemo(() => {
    const list = listTasksQuery.data?.status === "success"
      ? (listTasksQuery.data.data ?? [])
      : props.tasks;
    return [...list].sort(
      (a, b) => a.difficulty_rating - b.difficulty_rating,
    );
  }, [listTasksQuery.data, props.tasks]);
  const visibleTasks = useMemo(
    () => tasks.filter((task) => taskMatchesFilters(task, filters, query)),
    [tasks, filters, query],
  );

  const onQueryChange = useCallback((next: string) => {
    setQuery(next);
  }, []);

  const onClearFilters = useCallback(() => {
    setQuery("");
    setSearchResetKey((key) => key + 1);
    setFilters(emptyTaskFilters);
  }, []);

  let userMaxScores = props.userMaxScores ?? userMaxScoresQuery.data;

  if (listTasksQuery.error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
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
              onChange={setFilters}
              olympiads={olympiads}
              searchResetKey={searchResetKey}
              initialQuery={query}
              queryActive={query.trim() !== ""}
              onQueryChange={onQueryChange}
              onClear={onClearFilters}
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
                  onChange={setFilters}
                  olympiads={olympiads}
                  searchResetKey={searchResetKey}
                  initialQuery={query}
                  queryActive={query.trim() !== ""}
                  onQueryChange={onQueryChange}
                  onClear={onClearFilters}
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </main>
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
    <div className="grid grid-cols-1 min-[1620px]:grid-cols-2 min-[2240px]:grid-cols-3 gap-3 ">
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
