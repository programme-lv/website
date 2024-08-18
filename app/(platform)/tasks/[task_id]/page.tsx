export const revalidate = 60 * 2; // 2 minutes

import React from "react";

import { getTaskById } from "@/lib/tasks";

import TaskDetailsPage from "./task-page";

export default async function TaskPageServerComponent({
  params,
}: {
  params: { task_id: string };
}) {
  const tasks = await getTaskById(params.task_id as string);

  return <TaskDetailsPage task={tasks.data ?? null} />;
}
