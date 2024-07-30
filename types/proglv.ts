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

type Language = {
  id: string;
  fullName: string;
  monacoID: string;
  enabled: boolean;
};

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
  examples: Example[];
  default_pdf_statement_url?: string;
  origin_notes?: Record<string, string>;
};

type Example = {
  input: string;
  output: string;
  note?: string;
};

type MarkdownStatement = {
  story: string;
  input: string;
  output: string;
  notes?: string;
  scoring?: string;
};

type Submission = {
  uuid: string;
  submission: string;
  username: string;
  createdAt: string;
  evaluation: Evaluation;
  language: Language;
  task: {
    name: string;
    code: string;
  };
};

type User = {
  uuid: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type {
  ProgrammingLanguage,
  Evaluation,
  Language,
  TaskReference,
  Submission,
  User,
  Task,
  MarkdownStatement,
};
