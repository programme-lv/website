import renderMD from "@/lib/render"
import queryTaskDescription from "./queryTaskDesc"
import 'katex/dist/katex.min.css'
import { TaskTabs } from "./TaskTabs"
import { Group, Stack } from "@mantine/core"

type Examples = { id: string, input: string, answer: string }[]

export type Task = {
    name: string;
    description: {
        story: string;
        input: string;
        output: string;
        examples: Examples;
    };
    constraints: {
        timeLimitMs: number;
        memoryLimitKb: number;
    };
}

export default async function TaskView(props: any) {
    let task = await queryTaskDescription(props.params.code)
    return (
        <Group grow w={"100%"}>
            <Stack h="100%">
                <h1>Uzdevums "{task.name}"</h1>
                <TaskTabs task={task as Task}/>
            </Stack>
            <Stack c={"blue"} bg="blue" h="100%" w={100}>

            </Stack>
        </Group>
    )
}

