'use client';

import { Tabs, rem } from "@mantine/core";
import TaskView from "./TaskView";
import { Task } from "./page";

type TaskTabsProps = {
    task: Task;
}

export function TaskTabs({task}:TaskTabsProps) {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="task">
      <Tabs.List>
        <Tabs.Tab value="task" >
            Apraksts
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="task">
        <TaskView task={task}/>
      </Tabs.Panel>
    </Tabs>
  );
}