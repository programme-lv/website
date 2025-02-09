type Task = {
    published_task_id: string;
    task_full_name: string;
    memory_limit_megabytes: number;
    cpu_time_limit_seconds: number;
    origin_olympiad: string;
    lv_pdf_statement_sha: string;
    illustration_img_url?: string;
    difficulty_rating: 1 | 2 | 3 | 4 | 5;
    default_md_statement?: MarkdownStatement;
    examples?: Example[];
    default_pdf_statement_url?: string;
    origin_notes?: Record<string, string>;
    visible_input_subtasks?: VisibleInputSubtask[];
    statement_subtasks?: SubtaskOverview[];
};

type SubtaskOverview = {
    subtask: number;
    score: number;
    descriptions: Record<string, string>;
};

type StInputs = {
    subtask: number;
    inputs: string[];
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
    images?: MdImg[];
};

type MdImg = {
    img_uuid: string;
    http_url: string;
    width_em: number;
    width_px: number;
    height_px: number;
};

export type {
    Task,
    SubtaskOverview,
    StInputs,
    VisibleInputSubtask,
    TestWithOnlyInput,
    Example,
    MarkdownStatement,
    MdImg,
};