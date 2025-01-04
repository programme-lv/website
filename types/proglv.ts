type TaskReference = {
  name: string;
  code: string;
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
  SubmListSseUpdate as SubmListWebSocketUpdate,
  EvalStateUpdate,
  TestgroupResUpdate,
  ProgrammingLang,
  TestsResUpdate,
  TestGroup,
  TestSet,
  Submission,
  PrLang,
  SubmEval,
  Subtask,
  Verdict,
  SubmEvalUpdate
};
