export const revalidate = 120; // 2 minutes

import React from "react";
import { Metadata } from "next";

import { listTaskFilters, listTasks } from "@/lib/task/tasks";
import Layout from "@/components/layout";

import { TaskList } from "./task-list";
import { parseTaskListSearchParams } from "./origin-filter";
import whoami from "@/lib/user/whoami";
import { getMaxScorePerTaskServerSide } from "@/lib/subm/list-ss";
import { MaxScorePerTask } from "@/types/scores";

export const metadata: Metadata = {
  title: "Uzdevumi",
};

export default async function TaskListServerComponent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [tasks, filterTree, params] = await Promise.all([
    listTasks(),
    listTaskFilters(),
    searchParams,
  ]);
  const { filters, query } = parseTaskListSearchParams(params);

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

  return (
    <Layout active="tasks">
      <TaskList
        tasks={tasks.data ?? []}
        filterTree={filterTree.status === "success" ? filterTree.data : undefined}
        userMaxScores={userMaxScores}
        initialFilters={filters}
        initialQuery={query}
      />
    </Layout>
  );
}
