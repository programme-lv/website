export const dynamic = 'force-dynamic'
export const revalidate = 0

import queryTaskDescription from "./queries/queryTaskDesc"
import { ClientTaskView } from "./components/ClientTaskView"
import renderMD from "@/lib/render"

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
    const task = await queryTaskDescription(props.params.code)

    // bypass readonly, forgive me god for i have sinned
    let rendered = JSON.parse(JSON.stringify(task)) 
    rendered.description.story = renderMD(task.description.story)
    rendered.description.input = renderMD(task.description.input)
    rendered.description.output = renderMD(task.description.output)

    return (
        <ClientTaskView task={rendered}/>
    )
}

