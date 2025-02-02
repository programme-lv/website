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

export type {
  ProgrammingLanguage,
  Evaluation,
  TaskReference,
  User,
  EvalStateUpdate,
  TestgroupResUpdate,
  ProgrammingLang,
  TestsResUpdate,
  TestGroup,
  TestSet,
  Subtask,
};
