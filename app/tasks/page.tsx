"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/components/cn";
import { Avatar, Button, ScrollShadow, Spacer } from "@nextui-org/react";
import Alert from "@/components/Alert";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useQuery } from "react-query";
import { listTasks } from "@/lib/tasks";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Logo from "@/public/logo.png";
import Image from "next/image";

export default function TaskList() {
  const { data, error, isLoading } = useQuery("tasks", listTasks);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  return (
        <main className="mt-4 w-full overflow-visible">
          <div className="flex flex-col items-center p-4 gap-3">
            {data && data.length > 0 ? (
              data.map((task) => (
                <Link
                  href={`/tasks/${task.published_task_id}`}
                  key={task.published_task_id}
                  className="contents"
                >
                  <TaskCard key={task.published_task_id} task={task} />
                </Link>
              ))
            ) : (
              <p>No tasks found</p>
            )}
          </div>
        </main>
  );
}
