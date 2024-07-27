"use client";

import React from "react";
import Alert from "@/components/Alert";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useQuery } from "react-query";
import { listTasks } from "@/lib/tasks";
import Link from "next/link";

export default function TaskList() {
  let { data, error, isLoading } = useQuery("tasks", listTasks);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  return (
    <main className="mt-4 flex-grow w-full overflow-visible">
      <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 min-[1800px]:grid-cols-3 min-[2400px]:grid-cols-4 min-[3000px]:grid-cols-5 gap-4 p-4">
        {data && data.length > 0 ? (
          data.map((task) => (
            <Link
              href={`/tasks/${task.published_task_id}`}
              key={task.published_task_id}
              className="contents"
            >
              <TaskCard key={task.published_task_id} task={task} />
            </Link>
          ))
        ) : (
          <p>No tasks found</p>
        )}
      </div>
    </main>
  );
}
