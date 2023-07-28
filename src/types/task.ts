export type Task = {
    id: string
    code: string
    name: string

    description: {
        id: string
        story: string
        input: string
        output: string
    }

    constraints: {
        timeLimitMs: number
        memoryLimitKb: number
    }

    metadata: {
        authors: string[]
        origin: string
    }
}

export default Task;
