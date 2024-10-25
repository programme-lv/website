export const revalidate = 60 * 10; // 10 minutes

import React from "react";

import { listTasks } from "@/lib/tasks";

import { TaskList } from "./task-list";
import Layout from "@/components/layout";

export default async function TaskListServerComponent() {
  const tasks = await listTasks();

  const breadcrumbs = [
    { label: "Uzdevumi", href: "/tasks" },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <TaskList tasks={tasks.data ?? []} />;
    </Layout>
  );
}
