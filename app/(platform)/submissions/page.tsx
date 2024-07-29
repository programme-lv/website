"use client";

import React, { useMemo } from "react";
import Alert from "@/components/Alert";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useQuery } from "react-query";
import { Task, listTasks } from "@/lib/tasks";
import Link from "next/link";
import SubmissionTable from "@/components/submissions-table";

export default function SubmissionList() {
  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <SubmissionTable/>
    </main>
  );
}
