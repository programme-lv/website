export const revalidate = 120; // 2 minutes

import React from "react";

import { listTasks } from "@/lib/task/tasks";
import Layout from "@/components/layout";

import { TaskList } from "./task-list";
import whoami from "@/lib/user/whoami";
import { getMaxScorePerTaskServerSide } from "@/lib/subm/list-ss";
import { MaxScorePerTask } from "@/types/scores";

export default async function TaskListServerComponent() {
  const tasks = await listTasks();

  // Load current user and their per-task scores on the server
  const me = await whoami();
  let userMaxScores: MaxScorePerTask | undefined = undefined;
  const username = me?.data?.username;
  if (username) {
    try {
      userMaxScores = await getMaxScorePerTaskServerSide(username);
    } catch (e) {
      // noop: keep undefined on error
    }
  }

  const breadcrumbs = [{ label: "Uzdevumi", href: "/tasks" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="tasks">
      <div className="px-3">
        <TaskList tasks={tasks.data ?? []} userMaxScores={userMaxScores} />
      </div>
    </Layout>
  );
}
