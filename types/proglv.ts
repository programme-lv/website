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

type TestGroup = {
  points: number;
  subtasks: number[];
  tg_tests: number[];
};

type TestSet = {
  accepted: number;
  wrong: number;
  untested: number;
};

type Subtask = {
  points: number;
  description: string;
  st_tests: number[];
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
  compile_exec_info?: RuntimeData;
};

type TestResult = {
  test_id: number;
  reached: boolean;
  ignored: boolean;
  finished: boolean;
  input_trimmed: string | null;
  answer_trimmed: string | null;
  time_exceeded: boolean;
  memory_exceeded: boolean;
  subtasks: number[];
  test_groups: number[];
  subm_exec_info?: RuntimeData;
  checker_exec_info?: RuntimeData;
};

type RuntimeData = {
  cpu_time_millis: number;
  mem_kibi_bytes: number;
  wall_time: number;
  exit_code: number;
  stdout_trimmed: string;
  stderr_trimmed: string;
  exit_signal: number | null;
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

type SubmListSseUpdate =
  | { subm_created: Submission }
  | { eval_update: SubmEvalUpdate };
  // | { state_update: EvalStateUpdate }
  // | { testgroup_res_update: TestgroupResUpdate }
  // | { tests_score_update: TestsResUpdate };

type SubmEvalUpdate = {
  subm_uuid: string;
  new_eval: SubmEval;
};

type Submission = {
  subm_uuid: string;
  content: string;
  username: string;
  curr_eval: SubmEval;
  pr_lang: PrLang;
  task_name: string;
  task_id: string;
  created_at: string;
};

type PrLang = {
  short_id: string;
  display: string;
  monaco_id: string;
};

type SubmEval = {
  eval_uuid: string;
  eval_stage: string;
  score_unit: "test" | "group";
  eval_error: string;
  error_msg: string;
  subtasks: Subtask[];
  test_groups: TestGroup[];
  test_verdicts: Verdict[];
};

type Verdict = "ac" | "wa" | "tle" | "mle" | "re" | "ig" | "t" | "q" | "";

export type {
  ProgrammingLanguage,
  Evaluation,
  TaskReference,
  User,
  Task,
  MarkdownStatement,
  Example,
  StInputs,
  SubmListSseUpdate as SubmListWebSocketUpdate,
  EvalStateUpdate,
  TestgroupResUpdate,
  ProgrammingLang,
  EvalDetails,
  TestResult,
  TestsResUpdate,
  TestWithOnlyInput,
  VisibleInputSubtask,
  SubtaskOverview,
  TestGroup,
  MdImg,
  TestSet,
  Submission,
  PrLang,
  SubmEval,
  Subtask,
  Verdict,
  SubmEvalUpdate
};
