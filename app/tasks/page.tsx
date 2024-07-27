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
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

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
    <div className="flex h-dvh w-full">
      <div
        className={cn(
          "relative flex h-full w-60 flex-col !border-r-small border-divider p-6 transition-width",
          {
            "w-16 items-center px-2 py-6": isCompact,
          },
        )}
      >
        <div className={cn("flex items-center gap-3 px-3",
            {"justify-center gap-0": isCompact,},)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            {/* <AcmeIcon className="text-background" /> */}
            <Image src={Logo} alt="programme.lv logo" height={40}/>
          </div>
          <span
            className={cn("text-small font-bold uppercase opacity-100", {
              "w-0 opacity-0": isCompact,
            })}
          >
            programme.lv
          </span>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey="tasks"
            isCompact={isCompact}
            items={sectionItemsWithTeams}
          />
        </ScrollShadow>
      </div>
      <div className="w-full flex-1 flex-col p-3">
        <header className="flex items-center gap-3 rounded-medium border-small border-divider p-2">
          <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:sidebar-minimalistic-outline"
              width={24}
            />
          </Button>
          <h2 className="text-medium font-medium text-default-700">Uzdevumi</h2>
        </header>
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
      </div>
    </div>
  );
}
