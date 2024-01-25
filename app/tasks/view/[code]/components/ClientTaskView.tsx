'use client';

import { Tabs } from "@mantine/core";
import TaskStory from "./TaskStory";
import { Task } from "../page";

type TaskTabsProps = {
    task: Task;
}

export function ClientTaskView({task}:TaskTabsProps) {
  return (
    <Tabs defaultValue="task" h={"100%"} display="flex" style={{flexDirection:"column"}}>
      <Tabs.List>
        <Tabs.Tab value="task" >
            Apraksts
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="task" bg={"white"} p={0} display={"flex"} style={{flexGrow:1, position:"relative"}}>
        <div style={{height:"100%", width:"100%", overflow:"auto", position:"absolute"}}>
        <TaskStory task={task}/>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}