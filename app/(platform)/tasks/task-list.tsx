"use client";

import React from "react";
import { useQuery } from "react-query";
import Link from "next/link";

import Alert from "@/components/Alert";
import { listTasks } from "@/lib/tasks";
import { Task } from "@/types/proglv";
import TaskCard from "@/components/task-list-card";

export function TaskList(props: { tasks: Task[] }) {
  let {
    data: listTasksData,
    error,
    isLoading,
  } = useQuery("list-tasks", listTasks, {
    staleTime: 30 * 1000, // 30 seconds
  });

  let data = listTasksData ? (listTasksData.data ?? []) : props.tasks;

  // sort by difficulty
  data = data?.sort(
    (a: Task, b: Task) => a.difficulty_rating - b.difficulty_rating,
  );

  if (error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <div className="grid grid-cols-1 min-[1340px]:grid-cols-2 min-[1960px]:grid-cols-3 gap-3 ">
        {data && data.length > 0 ? (
          data.map((task) => (
            <Link
              key={task.published_task_id}
              className="contents"
              href={`/tasks/${task.published_task_id}`}
              prefetch={true}
            >
              <TaskCard key={task.published_task_id} {...task} />
            </Link>
          ))
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
