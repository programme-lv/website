export type Task = {
    id: string
    fullName: string
    origin: string
    authors: string[]
    versions: {
        id: string
        versionName: string
        timeLimitMs: number
        memoryLimitKb: number
        createdAt: string
        updatedAt: string
        evalType: {
            id: string
            descriptionEn: string
        }
    }[]
}

export default Task;
