'use client';

import { Stack, Tabs, rem } from "@mantine/core";
import TaskView from "./TaskView";
import { Task } from "./page";

type TaskTabsProps = {
    task: Task;
}

export function TaskTabs({task}:TaskTabsProps) {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="task" h={"100%"} display="flex" style={{flexDirection:"column"}}>
      <Tabs.List>
        <Tabs.Tab value="task" >
            Apraksts
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="task" bg={"white"} p={0} display={"flex"} style={{flexGrow:1, position:"relative"}}>
        <div style={{height:"100%", width:"100%", overflow:"scroll", position:"absolute"}}>
        <TaskView task={task}/>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}