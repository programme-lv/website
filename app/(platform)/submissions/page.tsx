"use client";

import React, { useMemo } from "react";
import Alert from "@/components/Alert";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useQuery } from "react-query";
import { Task, listTasks } from "@/lib/tasks";
import Link from "next/link";
import SubmissionTable from "@/components/submissions-table";

export default function SubmissionList() {
  let { data, error, isLoading } = useQuery("tasks", listTasks);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  // sort by difficulty
  data = data?.sort((a:Task, b:Task) => a.difficulty_rating - b.difficulty_rating);

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <SubmissionTable/>
    </main>
  );
}
