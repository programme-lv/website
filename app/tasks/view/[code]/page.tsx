import queryTaskDescription from "./queryTaskDesc"
import { TaskTabs } from "./TaskTabs"
import { Flex, Text, Group, Stack, Title } from "@mantine/core"
import RightSide from "./RightSide"

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
        <Flex w={"100%"} gap={"sm"}>
            <Stack h="100%" style={{flexGrow:1}}>
                <Title order={2} my={"md"}>Uzdevums "{task.name}"</Title>
                <TaskTabs task={task as Task}/>
            </Stack>
            <RightSide/>
        </Flex>
    )
}

