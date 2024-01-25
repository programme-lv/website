'use client';
import { MDDiv } from "@/components/MDDiv/MDDiv";
import { Text, Card, SimpleGrid, Group, Stack } from "@mantine/core";
import Link from "next/link";

const mockTask = {
    code: "summa",
    name: "Saskaiti skaitļus!",
    shortDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, minima nisi? Possimus."
}

type ClientTasksProps = {
    tasks: {
        code: string;
        name: string;
        shortDesc: string;
    }[]
}

export default function ClientTasks({ tasks }: ClientTasksProps) {
    console.log(tasks)
    return (
        <div style={{ width: "100%" }}>
            <SimpleGrid cols={1} verticalSpacing="xl" pt={"sm"}>
                {tasks.map(task => <TaskCard {...task} />)}
            </SimpleGrid>
        </div>
    );
}

type TaskCardProps = {
    code: string; // used for navigation
    name: string;
    shortDesc: string;
}

function TaskCard({ code, name, shortDesc }: TaskCardProps) {
    return (
        <Link href={`/tasks/view/${code}`} style={{ textDecoration: 'none' }}>
            <Card withBorder padding={"md"} p={"lg"}>
                <Stack>
                    <Text fw={500} size="lg">{name}</Text>
                    <Text my={"-1em"}><MDDiv>{shortDesc}</MDDiv></Text>
                </Stack>
            </Card>
        </Link>
    )
} 