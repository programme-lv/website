type IllustrationImage = {
    http_url: string;
    list_http_url?: string;
    view_http_url?: string;
    width_px: number;
    height_px: number;
    sz_in_bytes: number;
};

export function illustrationUrl(img: IllustrationImage, variant: "list" | "view" | "full"): string {
    if (variant === "list") {
        return img.list_http_url || img.http_url;
    }
    if (variant === "view") {
        return img.view_http_url || img.http_url;
    }
    return img.http_url;
}

type Task = {
    short_task_id: string;
    task_full_name: string;
    memory_limit_megabytes: number;
    cpu_time_limit_seconds: number;
    origin_olympiad: string;
    illustration_img?: IllustrationImage;
    difficulty_rating: 1 | 2 | 3 | 4 | 5;
    default_md_statement?: MarkdownStatement;
    examples?: Example[];
    origin_notes?: Record<string, string>;
    visible_input_subtasks?: VisibleInputSubtask[];
    statement_subtasks?: SubtaskOverview[];
    statement_images?: StatementImage[];
    testing_type: "checker" | "interactor";
};

type SubtaskOverview = {
    subtask: number;
    score: number;
    descriptions: Record<string, string>;
};

type VisibleInputSubtask = {
    subtask: number;
    inputs: TestWithOnlyInput[];
};

type TestWithOnlyInput = {
    test_id: number;
    input: string;
};

type Example = {
    input: string;
    output: string;
    md_note?: string;
};

type MarkdownStatement = {
    story: string;
    input: string;
    output: string;
    notes?: string;
    scoring?: string;
    talk?: string;
    example?: string;
};

type StatementImage = {
    filename: string;
    http_url: string;
    width_px: number;
    height_px: number;
    object_key: string;
    sz_in_bytes: number;
};

type TaskPreview = {
    short_id: string;
    full_name: string;
    illustr_img?: IllustrationImage;
    difficulty_rating: 1 | 2 | 3 | 4 | 5;
    origin_olympiad?: string;
    origin_year?: string;
    olymp_stage?: string;
    origin_divisions?: string[];
    origin_note?: string;
    origin_note_short?: string;
};

type TaskFilterDivision = {
    id: string;
    count: number;
};

type TaskFilterStage = {
    id: string;
    count: number;
    divisions: TaskFilterDivision[];
};

type TaskFilterYear = {
    id: string;
    count: number;
    stages: TaskFilterStage[];
};

type TaskFilterOlympiad = {
    id: string;
    count: number;
    years: TaskFilterYear[];
};

type TaskFilterTree = {
    olympiads: TaskFilterOlympiad[];
};

export type {
    Task,
    IllustrationImage,
    SubtaskOverview,
    VisibleInputSubtask,
    Example,
    MarkdownStatement,
    StatementImage,
    TaskPreview,
    TaskFilterTree,
    TaskFilterOlympiad,
    TaskFilterYear,
    TaskFilterStage,
    TaskFilterDivision,
};
