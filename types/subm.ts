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
  received_score: number;
  possible_score: number;
  max_cpu_ms: number;
  max_mem_mib: number;
};

type SubmEval = {
  eval_uuid: string;
  subm_uuid: string;
  eval_stage: string;
  score_unit: "test" | "group";
  eval_error: string;
  subtasks: Subtask[];
  test_groups: TestGroup[];
  verdicts: string; // q,ac,wa,tle,mle,re,ig -> "QAWTMRI"
  score_info: ScoreInfo;
};

// verdict is a string of characters, each character is a verdict
// q,ac,wa,tle,mle,re,ig -> "QAWTMRI"
type Verdict = "Q" | "A" | "W" | "T" | "M" | "R" | "I";

type Subtask = {
  points: number;
  description: string;
  st_tests: number[][];
};

type TestGroup = {
  points: number;
  subtasks: number[];
  tg_tests: number[][];
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