export const revalidate = 120; // 2 minutes

import React from "react";

import { listTasks } from "@/lib/task/tasks";
import Layout from "@/components/layout";

import { TaskList } from "./task-list";

export default async function TaskListServerComponent() {
  const tasks = await listTasks();

  const breadcrumbs = [{ label: "Uzdevumi", href: "/tasks" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="tasks">
      <div className="px-3">
        <TaskList tasks={tasks.data ?? []} />
      </div>
    </Layout>
  );
}
