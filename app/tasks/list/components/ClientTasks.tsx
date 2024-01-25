'use client';
import { SimpleGrid, Group } from "@mantine/core";
import { TaskCard } from "./TaskCard";

type ClientTasksProps = {
    tasks: {
        code: string;
        name: string;
        shortDesc: string;
    }[]
}

export default function ClientTasks({ tasks }: ClientTasksProps) {
    return (
        <div style={{ width: "100%" }}>
            <SimpleGrid cols={1} verticalSpacing="xl" pt={"sm"}>
                {tasks.map((task,i) =>
                <TaskCard key={i} code={task.code} name={task.name} 
                shortDesc={task.shortDesc} />)}
            </SimpleGrid>
        </div>
    );
}

