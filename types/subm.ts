export type SubmListSseUpdate =
  | { subm_created: SubmListEntry }
  | { eval_update: SubmEval };

type ScoreInfo = {
  score_bar: {
    green: number;
    red: number;
    gray: number;
    yellow: number;
    purple: number;
  };
  received: number;
  possible: number;
  max_cpu_ms: number;
  max_mem_kib: number;
  exceeded_cpu: boolean;
  exceeded_mem: boolean;
};

type SubmEval = {
  eval_uuid: string;
  subm_uuid: string;
  eval_stage: string;
  score_unit: "test" | "group";
  eval_error: string;
  subtasks: Subtask[];
  test_groups: TestGroup[];
  verdicts: Verdict[]; // q,ac,wa,tle,mle,re,ig -> "QAWTMRI"
  score_info: ScoreInfo;
};

// verdict is a string of characters, each character is a verdict
// q,ac,wa,tle,mle,re,ig -> "QAWTMRI"
export type Verdict = "Q" | "A" | "W" | "T" | "M" | "R" | "I";

type Subtask = {
  points: number;
  description: string;
  st_tests: number[][];
};

type TestGroup = {
  points: number;
  subtasks: number[];
  tg_tests: [number, number][]; // [start, end]
};

export type SubmListEntry = {
  subm_uuid: string;
  username: string;
  task_id: string;
  task_name: string;
  pr_lang_id: string;
  pr_lang_name: string;
  score_info: ScoreInfo;
  status: string;
  created_at: string;
};

export type DetailedSubmView = {
  subm_uuid: string;
  content: string;
  username: string;
  curr_eval: SubmEval;
  pr_lang: PrLang;
  task_id: string;
  task_name: string;
  created_at: string;
};

export type PrLang = {
  short_id: string;
  display: string;
  monaco_id: string;
};

export type PaginatedSubmListResponse = {
  page: SubmListEntry[];
  pagination: {
    total: number;
    offset: number;
    limit: number; // number of items per page
    hasMore: boolean;
  };
};
