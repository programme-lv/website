import queryTaskDescription from "./queryTaskDesc"
import { TaskTabs } from "./TaskTabs"
import { Flex, Text, Group, Stack, Title } from "@mantine/core"
import RightSideLayout from "./RightSide"
import queryLanguages from "./queryLanguages"
import MyEditor from "./MyEditor"

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
async function setSelectedLanguage(lang: string) {
    'use server';
    console.log("setSelectedLanguage", lang)
}

async function setCode(code: string) {
    'use server';
    console.log("setCode", code)
}

export default async function TaskView(props: any) {
    const task = await queryTaskDescription(props.params.code)
    const languages = await queryLanguages();
    console.log("languages", languages)
    return (
        <Flex w={"100%"} gap={"sm"}>
            <Stack h="100%" style={{flexGrow:1}}>
                <Title order={2} my={"md"}>Uzdevums "{task.name}"</Title>
                <TaskTabs task={task as Task}/>
            </Stack>
            <RightSideLayout>
                <MyEditor
                    selectedLanguage={""}
                    setSelectedLanguage={setSelectedLanguage}
                    code={""}
                    setCode={setCode}
                    langs={[]}
                />
            </RightSideLayout>
        </Flex>
    )
}

