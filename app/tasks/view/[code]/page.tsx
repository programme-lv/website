import renderMD from "@/lib/render"
import queryTaskDescription from "./queryTaskDesc"
import 'katex/dist/katex.min.css'
import { TaskTabs } from "./TaskTabs"

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
        <div>
            <h1>Uzdevums "{task.name}"</h1>
            <div>
                <TaskTabs task={task as Task}/>
            </div>
        </div>
    )
}

