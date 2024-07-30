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

type Task = {
  name: string;
  code: string;
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
}

export type { ProgrammingLanguage, Evaluation, Language, Task, Submission, User };
