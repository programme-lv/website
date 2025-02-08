export type MaxScore = {
    task_id: string;
    task_full_name: string;
    received: number;
    possible: number;
    created_at: string;
}

export type MaxScorePerTask = {
    [task_id: string]: MaxScore;
}