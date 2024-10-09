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
}

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
  eval_scoring_tests: {
    accepted: number;
    wrong: number;
    untested: number;
  };
  p_lang_id: string;
  p_lang_display_name: string;
  p_lang_monaco_id: string;
  task_name: string;
  task_id: string;
  user_uuid: string;
  user_username: string;
};

type ProgrammingLang = {
  id: string;
  fullName: string;
  codeFilename: string;
  compileCmd: string;
  executeCmd: string;
  envVersionCmd: string;
  helloWorldCode: string;
  monacoId: string;
  compiledFilename: string;
  enabled: boolean;
};

type EvalDetails = {
  eval_uuid: string;
  created_at_rfc3339: string;
  error_msg: string | null;
  eval_stage: string;
  cpu_time_limit_millis: number;
  memory_limit_kibi_bytes: number;
  programming_lang: ProgrammingLang;
  system_information: string;
  compile_cpu_time_millis: number;
  compile_mem_kibi_bytes: number;
  compile_wall_time: number;
  compile_exit_code: number;
  compile_stdout_trimmed: string;
  compile_stderr_trimmed: string;
};

type TestResult = {
  test_id: number;
  reached: boolean;
  ignored: boolean;
  finished: boolean;
  input_trimmed: string | null;
  answer_trimmed: string | null;
  time_limit_exceeded: boolean;
  memory_limit_exceeded: boolean;
  subtasks: number[];
  test_group: number;
  subm_cpu_time_millis?: number;
  subm_mem_kibi_bytes?: number;
  subm_wall_time: number;
  subm_exit_code: number;
  subm_stdout_trimmed: string;
  subm_stderr_trimmed: string;
  subm_exit_signal?: number;
  checker_cpu_time_millis: number;
  checker_mem_kibi_bytes: number;
  checker_wall_time: number;
  checker_exit_code: number;
  checker_stdout_trimmed: string;
  checker_stderr_trimmed: string;
};

type FullSubmission = BriefSubmission & {
  subm_content: string;
  eval_test_results: TestResult[];
  eval_details: EvalDetails;
};

type ProgrammingLanguage = {
  id: string;
  fullName: string;
  monacoId: string;
  enabled: boolean;
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

type EvalStateUpdate = {
  subm_uuid: string;
  eval_uuid: string;
  new_state: string;
};

type TestgroupResUpdate = {
  subm_uuid: string;
  eval_uuid: string;
  test_group_id: number;
  accepted_tests: number;
  wrong_tests: number;
  untested_tests: number;
};

type TestsResUpdate = {
  subm_uuid: string;
  eval_uuid: string;
  accepted: number;
  wrong: number;
  untested: number;
};

type SubmListWebSocketUpdate =
  | { subm_created: BriefSubmission }
  | { state_update: EvalStateUpdate }
  | { testgroup_res_update: TestgroupResUpdate }
  | { tests_score_update: TestsResUpdate };

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
  FullSubmission,
  ProgrammingLang,
  EvalDetails,
  TestResult,
  TestsResUpdate,
  TestWithOnlyInput,
  VisibleInputSubtask,
  SubtaskOverview,
};
