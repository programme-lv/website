'use client';

import { Card, Tabs } from "@mantine/core";
import TaskStory from "./TaskStory";
import { GetStableTaskVersionByPublishedTaskCodeForTaskViewQuery } from "@/gql/graphql";

type Task = GetStableTaskVersionByPublishedTaskCodeForTaskViewQuery['getTaskByPublishedTaskCode'];

export function ClientTaskView({task}:{task:Task}) {
  return (
    <Tabs defaultValue="task" h={"100%"} display="flex" style={{flexDirection:"column"}}>
      <Tabs.List>
        <Tabs.Tab value="task" >
            Apraksts
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="task" bg={"white"} p={0} display={"flex"} style={{flexGrow:1, position:"relative"}}>
        <Card withBorder p={0} style={{height:"100%", width:"100%", overflow:"auto", position:"absolute"}}>
        <TaskStory task={task}/>
        </Card>
      </Tabs.Panel>
    </Tabs>
  );
}