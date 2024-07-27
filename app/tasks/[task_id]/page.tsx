"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTaskById } from "@/lib/tasks";
import Alert from "@/components/Alert";
import Sidebar from "@/components/sidebar";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/components/cn";
import { Button, Icon } from "@nextui-org/react";
import { Task } from "@/lib/tasks";

const TaskDetailsPage = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const { task_id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(task_id as string);
        setTask(fetchedTask);
      } catch (err) {
        setError("Failed to load task details");
      }
    };

    fetchTask();
  }, [task_id]);

  if (error) {
    return <Alert message={error} type="error" onClose={() => setError(null)} />;
  }

  if (!task) {
    return <p>Loading task details...</p>;
  }

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
          <h2 className="text-medium font-medium text-default-700">Task Details</h2>
        </header>
        <main className="mt-4 h-full w-full overflow-visible">
    <div className="flex flex-col items-center p-4 gap-3">
      <h1 className="text-2xl font-bold mb-4">{task.task_full_name}</h1>
      {task.default_pdf_statement_url ? (
        <iframe
          src={task.default_pdf_statement_url}
          width="100%"
          height="600px"
          title="Task Statement"
        />
      ) : (
        <p>No PDF statement available for this task.</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </main>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
