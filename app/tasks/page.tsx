"use client";

import React, { useMemo } from "react";
import Alert from "@/components/Alert";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useQuery } from "react-query";
import { listTasks } from "@/lib/tasks";
import Link from "next/link";

function shuffleArray(array:any) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export default function TaskList() {
  let { data, error, isLoading } = useQuery("tasks", listTasks);

  const shuffledData = useMemo(() => {
    return data ? shuffleArray(data) : [];
  }, [data]);

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
        {shuffledData && shuffledData.length > 0 ? (
          shuffledData.map((task) => (
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
