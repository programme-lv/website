import queryTaskDescription from "./quries/queryTaskDesc"
import { TaskTabs } from "./components/TaskTabs"

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
    // const languages = await queryLanguages();
    
    return (
        <TaskTabs task={task as Task}/>
    )
}

