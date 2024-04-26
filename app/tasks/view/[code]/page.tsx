export const dynamic = 'force-dynamic'
export const revalidate = 0

import queryTaskDescriptionTaskView from "./queries/queryTaskDesc"
import { ClientTaskView } from "./components/ClientTaskView"
import renderMD from "@/lib/renderMarkdown"

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
    let task = await queryTaskDescriptionTaskView(props.params.code)
    if(!task||!task.stable) return null
    if(!task.stable.description) return null

    task = JSON.parse(JSON.stringify(task))
    task!.stable!.description!.story = renderMD(task!.stable!.description!.story)
    task!.stable!.description!.input = renderMD(task!.stable!.description!.input)
    task!.stable!.description!.output = renderMD(task!.stable!.description!.output)

    return (
        <ClientTaskView task={task!}/>
    )
}

