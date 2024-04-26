'use client';
import { SimpleGrid, Group } from "@mantine/core";
import { TaskCard } from "./TaskCard";
import { ListPublishedTasksForTasksListQuery } from "@/gql/graphql";

type Task = ListPublishedTasksForTasksListQuery['listPublishedTasks'][number];

export default function ClientTasksList({ tasks }: {tasks:Task[]}) {
    return (
        <div style={{ width: "100%" }}>
            <SimpleGrid cols={1} verticalSpacing="xl" pt={"sm"}>
                {
                    tasks.map((task, i) =>
                        <TaskCard key={i} code={task.stable!.code} name={task.stable!.name} 
                            shortDesc={task.stable!.description!.story} />)
                }
            </SimpleGrid>
        </div>
    );
}


/*tasks.map((task,i) =>
<TaskCard key={i} code={task.code} name={task.name} 
shortDesc={task.shortDesc} />)*/