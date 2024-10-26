export const revalidate = 60 * 2; // 2 minutes

import React from "react";

import { listTasks } from "@/lib/tasks";
import Layout from "@/components/layout";

import { TaskList } from "./task-list";

export default async function TaskListServerComponent() {
  const tasks = await listTasks();

  const breadcrumbs = [{ label: "Uzdevumi", href: "/tasks" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="tasks">
      <TaskList tasks={tasks.data ?? []} />
    </Layout>
  );
}
