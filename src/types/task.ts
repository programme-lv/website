export type Task = {
    id: string
    code: string
    name: string

    Description: {
        id: string
        story: string
        input: string
        output: string
        notes: string
    }

    Constraints: {
        timeLimitMs: number
        memoryLimitKb: number
    }

    Metadata: {
        authors: string[]
        origin: string
    }
}

export default Task;
