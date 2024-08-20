type TaskReference = {
  name: string;
  code: string;
};

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
  visible_input_subtasks?: StInputs[];
};

type StInputs = {
  subtask: number;
  inputs: string[];
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
};

type BriefSubmission = {
  subm_uuid: string;
  // submission: string;
  username: string;
  created_at: string;
  eval_uuid: string;
  eval_status: string;
  eval_scoring_testgroups: {
    test_group_id: number;
    test_group_score: number;
    statement_subtask: number;
    accepted_tests: number;
    wrong_tests: number;
    untested_tests: number;
  }[];
  p_lang_id: string;
  p_lang_display_name: string;
  p_lang_monaco_id: string;
  task_name: string;
  task_id: string;
  user_uuid: string;
  user_username: string;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
};

type ProgrammingLanguage = {
  id: string;
  fullName: string;
  monacoId: string;
};

type Evaluation = {
  uuid: string;
  status: string;
  receivedScore: number;
  possibleScore: number;
};

type User = {
  uuid: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
};

interface EvalStateUpdate {
  subm_uuid: string;
  eval_uuid: string;
  new_state: string;
}

interface TestgroupResUpdate {
  subm_uuid: string;
  eval_uuid: string;
  test_group_id: number;
  accepted_tests: number;
  wrong_tests: number;
  untested_tests: number;
}

type SubmListWebSocketUpdate =
  | { subm_created: BriefSubmission }
  | { state_update: EvalStateUpdate }
  | { testgroup_res_update: TestgroupResUpdate };

export type {
  ProgrammingLanguage,
  Evaluation,
  TaskReference,
  BriefSubmission,
  User,
  Task,
  MarkdownStatement,
  Example,
  StInputs,
  SubmListWebSocketUpdate,
  EvalStateUpdate,
  TestgroupResUpdate,
};
