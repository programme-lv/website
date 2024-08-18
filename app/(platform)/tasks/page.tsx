export const revalidate = 60 * 10; // 10 minutes

import React from "react";

import { listTasks } from "@/lib/tasks";

import { TaskList } from "./task-list";

export default async function TaskListServerComponent() {
  const tasks = await listTasks();

  return <TaskList tasks={tasks.data ?? []} />;
}
