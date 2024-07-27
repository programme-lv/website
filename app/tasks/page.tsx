"use client";

import React from "react";
import { useQuery } from 'react-query';
import { listTasks } from "@/lib/tasks";
import TaskCard from "@/components/TaskCard/TaskCard";
import Alert from "@/components/Alert";
import Link from "next/link";

export default function TaskList() {
  const { data, error, isLoading } = useQuery('tasks', listTasks);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <Alert message="Failed to load tasks" type="error" onClose={() => null} />;
  }

  return (
    <div className="flex flex-col items-center p-4 gap-3">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      {data && data.length > 0 ? (
        data.map((task) => (
          <Link href={`/tasks/${task.published_task_id}`} key={task.published_task_id} className="contents">
          <TaskCard key={task.published_task_id} task={task} />
          </Link>
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
}
