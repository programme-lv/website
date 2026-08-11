type ProgrammingLanguage = {
  id: string;
  fullName: string;
  monacoId: string;
  enabled: boolean;
};

type User = {
  uuid: string;
  username: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  email_verified?: boolean;
};

export type { ProgrammingLanguage, User };
