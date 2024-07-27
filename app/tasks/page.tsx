"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/components/cn";
import { Button, Icon } from "@nextui-org/react";
import { useQuery } from 'react-query';
import { listTasks } from "@/lib/tasks";
import TaskCard from "@/components/TaskCard/TaskCard";
import Alert from "@/components/Alert";
import Link from "next/link";

export default function TaskList() {
  const { data, error, isLoading } = useQuery('tasks', listTasks);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <Alert message="Failed to load tasks" type="error" onClose={() => null} />;
  }

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex h-dvh w-full">
      <div
        className={cn(
          "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
          {
            "w-16 items-center px-2 py-6": isCompact,
          },
        )}
      >
        <Sidebar defaultSelectedKey="tasks" isCompact={isCompact} items={sectionItemsWithTeams} />
      </div>
      <div className="w-full flex-1 flex-col p-4">
        <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
          <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:sidebar-minimalistic-outline"
              width={24}
            />
          </Button>
          <h2 className="text-medium font-medium text-default-700">Tasks</h2>
        </header>
        <main className="mt-4 h-full w-full overflow-visible">
    <div className="flex flex-col items-center p-4 gap-3">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      {data && data.length > 0 ? (
        data.map((task) => (
          <Link href={`/tasks/${task.published_task_id}`} key={task.published_task_id} className="contents">
          <TaskCard key={task.published_task_id} task={task} />
          </Link>
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </main>
      </div>
    </div>
  );
}
