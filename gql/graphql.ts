/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Constraints = {
  __typename?: 'Constraints';
  memoryLimitKb: Scalars['Int']['output'];
  timeLimitMs: Scalars['Int']['output'];
};

export type Description = {
  __typename?: 'Description';
  examples?: Maybe<Array<Example>>;
  input: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  output: Scalars['String']['output'];
  story: Scalars['String']['output'];
};

export type Evaluation = {
  __typename?: 'Evaluation';
  /** Some programming languages do not support compilation, so this field may be null. */
  compileRData?: Maybe<RuntimeData>;
  id: Scalars['ID']['output'];
  possibleScore?: Maybe<Scalars['Int']['output']>;
  runtimeStatistics?: Maybe<RuntimeStatistics>;
  status: Scalars['String']['output'];
  testResults: Array<TestResult>;
  totalScore: Scalars['Int']['output'];
};

export type Example = {
  __typename?: 'Example';
  answer: Scalars['String']['output'];
  input: Scalars['String']['output'];
};

export type ExecutionResult = {
  __typename?: 'ExecutionResult';
  stderr: Scalars['String']['output'];
  stdout: Scalars['String']['output'];
};

export type Metadata = {
  __typename?: 'Metadata';
  authors?: Maybe<Array<Scalars['String']['output']>>;
  origin?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Creates a new task with the given name and code.
   * Only admins can create tasks.
   * The default task version is assigned to the task.
   */
  createTask: Task;
  deleteTask: Scalars['Boolean']['output'];
  enqueueSubmissionForPublishedTaskCodeStableTaskVersion: Submission;
  executeCode: ExecutionResult;
  login: User;
  logout: Scalars['Boolean']['output'];
  register: User;
  updateCurrentTaskVersionNameAndCodeByTaskID: TaskVersion;
  updateCurrentTaskVersionStatementByTaskID: TaskVersion;
};


export type MutationCreateTaskArgs = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  taskID: Scalars['ID']['input'];
};


export type MutationEnqueueSubmissionForPublishedTaskCodeStableTaskVersionArgs = {
  languageID: Scalars['ID']['input'];
  submissionCode: Scalars['String']['input'];
  taskCode: Scalars['String']['input'];
};


export type MutationExecuteCodeArgs = {
  code: Scalars['String']['input'];
  languageID: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateCurrentTaskVersionNameAndCodeByTaskIdArgs = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  taskID: Scalars['ID']['input'];
};


export type MutationUpdateCurrentTaskVersionStatementByTaskIdArgs = {
  statement: StatementInput;
  taskID: Scalars['ID']['input'];
};

export type ProgrammingLanguage = {
  __typename?: 'ProgrammingLanguage';
  enabled: Scalars['Boolean']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  monacoID?: Maybe<Scalars['ID']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getSubmission: Submission;
  /**
   * Finds task id in the published_task_codes table.
   * Returns the task with the given code.
   */
  getTaskByPublishedTaskCode: Task;
  /**
   * Returns the task with the given taskID.
   * Useful when we want to know when task was initiallly created.
   */
  getTaskByTaskID: Task;
  /**
   * Returns a list of all tasks that are editable by the current user.
   * Used for rendering the editable task list in task constructor.
   */
  listEditableTasks: Array<Task>;
  listLanguages: Array<ProgrammingLanguage>;
  /**
   * Returns all visible (not hidden) submissions for tasks that have a published task code.
   * An example of a hidden submission is a submission made by an admin for testing purposes.
   */
  listPublicSubmissions: Array<SubmissionOverview>;
  /**
   * Returns a list of all tasks that have a published version.
   * Used for rendering the public task view.
   */
  listPublishedTasks: Array<Task>;
  whoami?: Maybe<User>;
};


export type QueryGetSubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTaskByPublishedTaskCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryGetTaskByTaskIdArgs = {
  taskID: Scalars['ID']['input'];
};


export type QueryListLanguagesArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RuntimeData = {
  __typename?: 'RuntimeData';
  exitCode: Scalars['Int']['output'];
  memoryKb: Scalars['Int']['output'];
  stderr: Scalars['String']['output'];
  stdout: Scalars['String']['output'];
  timeMs: Scalars['Int']['output'];
};

export type RuntimeStatistics = {
  __typename?: 'RuntimeStatistics';
  avgMemoryKb: Scalars['Int']['output'];
  avgTimeMs: Scalars['Int']['output'];
  maxMemoryKb: Scalars['Int']['output'];
  maxTimeMs: Scalars['Int']['output'];
};

export type ShallowEvaluation = {
  __typename?: 'ShallowEvaluation';
  id: Scalars['ID']['output'];
  possibleScore?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  totalScore: Scalars['Int']['output'];
};

export type StatementInput = {
  input?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  output?: InputMaybe<Scalars['String']['input']>;
  story?: InputMaybe<Scalars['String']['input']>;
};

export type Submission = {
  __typename?: 'Submission';
  createdAt: Scalars['String']['output'];
  evaluation: Evaluation;
  id: Scalars['ID']['output'];
  language: ProgrammingLanguage;
  submission: Scalars['String']['output'];
  task: Task;
  username: Scalars['String']['output'];
};

export type SubmissionOverview = {
  __typename?: 'SubmissionOverview';
  createdAt: Scalars['String']['output'];
  evaluation: ShallowEvaluation;
  id: Scalars['ID']['output'];
  language: ProgrammingLanguage;
  task: TaskOverview;
  username: Scalars['String']['output'];
};

export type Task = {
  __typename?: 'Task';
  createdAt: Scalars['String']['output'];
  current: TaskVersion;
  stable?: Maybe<TaskVersion>;
  taskID: Scalars['ID']['output'];
};

export type TaskOverview = {
  __typename?: 'TaskOverview';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  taskID: Scalars['ID']['output'];
};

export type TaskVersion = {
  __typename?: 'TaskVersion';
  code: Scalars['String']['output'];
  constraints: Constraints;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Description>;
  metadata: Metadata;
  name: Scalars['String']['output'];
  versionID: Scalars['ID']['output'];
};

export type Test = {
  __typename?: 'Test';
  answer: Scalars['String']['output'];
  input: Scalars['String']['output'];
  name: Scalars['String']['output'];
  testID: Scalars['ID']['output'];
};

export type TestResult = {
  __typename?: 'TestResult';
  checkerRData?: Maybe<RuntimeData>;
  id: Scalars['ID']['output'];
  result: TestResultType;
  taskVTestID: Scalars['ID']['output'];
  userSubmRData?: Maybe<RuntimeData>;
};

export enum TestResultType {
  Ac = 'AC',
  Ig = 'IG',
  Ile = 'ILE',
  Ise = 'ISE',
  Mle = 'MLE',
  Pe = 'PE',
  Pt = 'PT',
  Re = 'RE',
  Sv = 'SV',
  Tle = 'TLE',
  Wa = 'WA'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UpdateCurrentTaskVersionNameAndCodeByTaskIdMutationVariables = Exact<{
  taskID: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type UpdateCurrentTaskVersionNameAndCodeByTaskIdMutation = { __typename?: 'Mutation', updateCurrentTaskVersionNameAndCodeByTaskID: { __typename?: 'TaskVersion', name: string, code: string, description?: { __typename?: 'Description', story: string, input: string, output: string, notes?: string | null } | null } };

export type GetTaskByTaskIdQueryVariables = Exact<{
  taskID: Scalars['ID']['input'];
}>;


export type GetTaskByTaskIdQuery = { __typename?: 'Query', getTaskByTaskID: { __typename?: 'Task', taskID: string, createdAt: string, current: { __typename?: 'TaskVersion', versionID: string, code: string, name: string, createdAt: string, description?: { __typename?: 'Description', story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', input: string, answer: string }> | null } | null, constraints: { __typename?: 'Constraints', timeLimitMs: number, memoryLimitKb: number } } } };

export type UpdateCurrentTaskVersionStatementByTaskIdMutationVariables = Exact<{
  taskID: Scalars['ID']['input'];
  statement: StatementInput;
}>;


export type UpdateCurrentTaskVersionStatementByTaskIdMutation = { __typename?: 'Mutation', updateCurrentTaskVersionStatementByTaskID: { __typename?: 'TaskVersion', versionID: string, code: string, name: string, createdAt: string, description?: { __typename?: 'Description', story: string, input: string, output: string, notes?: string | null } | null } };

export type CreateTaskMutationVariables = Exact<{
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', taskID: string, createdAt: string, current: { __typename?: 'TaskVersion', versionID: string, code: string, name: string, createdAt: string } } };

export type ListEditableTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type ListEditableTasksQuery = { __typename?: 'Query', listEditableTasks: Array<{ __typename?: 'Task', taskID: string, createdAt: string, current: { __typename?: 'TaskVersion', versionID: string, code: string, name: string, createdAt: string } }> };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = { __typename?: 'Query', whoami?: { __typename?: 'User', id: string, username: string, email: string, firstName: string, lastName: string, isAdmin: boolean } | null };

export type ListPublicSubmissionsForSubmissionListQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPublicSubmissionsForSubmissionListQuery = { __typename?: 'Query', listPublicSubmissions: Array<{ __typename?: 'SubmissionOverview', id: string, username: string, createdAt: string, evaluation: { __typename?: 'ShallowEvaluation', id: string, status: string, totalScore: number, possibleScore?: number | null }, language: { __typename?: 'ProgrammingLanguage', id: string, fullName: string, monacoID?: string | null, enabled: boolean }, task: { __typename?: 'TaskOverview', taskID: string, name: string, code: string } }> };

export type ListPublishedTasksForTasksListQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPublishedTasksForTasksListQuery = { __typename?: 'Query', listPublishedTasks: Array<{ __typename?: 'Task', taskID: string, createdAt: string, stable?: { __typename?: 'TaskVersion', versionID: string, code: string, name: string, createdAt: string, description?: { __typename?: 'Description', story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', input: string, answer: string }> | null } | null } | null }> };

export type ListLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLanguagesQuery = { __typename?: 'Query', listLanguages: Array<{ __typename?: 'ProgrammingLanguage', id: string, fullName: string, monacoID?: string | null, enabled: boolean }> };

export type GetStableTaskVersionByPublishedTaskCodeForTaskViewQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetStableTaskVersionByPublishedTaskCodeForTaskViewQuery = { __typename?: 'Query', getTaskByPublishedTaskCode: { __typename?: 'Task', taskID: string, createdAt: string, stable?: { __typename?: 'TaskVersion', versionID: string, code: string, name: string, createdAt: string, description?: { __typename?: 'Description', story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', input: string, answer: string }> | null } | null, constraints: { __typename?: 'Constraints', timeLimitMs: number, memoryLimitKb: number } } | null } };

export type GetTaskByPublishedTaskCodeForTaskNameQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetTaskByPublishedTaskCodeForTaskNameQuery = { __typename?: 'Query', getTaskByPublishedTaskCode: { __typename?: 'Task', stable?: { __typename?: 'TaskVersion', name: string } | null } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string, username: string } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', username: string, id: string } };


export const UpdateCurrentTaskVersionNameAndCodeByTaskIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCurrentTaskVersionNameAndCodeByTaskID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentTaskVersionNameAndCodeByTaskID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<UpdateCurrentTaskVersionNameAndCodeByTaskIdMutation, UpdateCurrentTaskVersionNameAndCodeByTaskIdMutationVariables>;
export const GetTaskByTaskIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaskByTaskID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTaskByTaskID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versionID"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeLimitMs"}},{"kind":"Field","name":{"kind":"Name","value":"memoryLimitKb"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTaskByTaskIdQuery, GetTaskByTaskIdQueryVariables>;
export const UpdateCurrentTaskVersionStatementByTaskIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCurrentTaskVersionStatementByTaskID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statement"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentTaskVersionStatementByTaskID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}}},{"kind":"Argument","name":{"kind":"Name","value":"statement"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statement"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versionID"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCurrentTaskVersionStatementByTaskIdMutation, UpdateCurrentTaskVersionStatementByTaskIdMutationVariables>;
export const CreateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versionID"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const ListEditableTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListEditableTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listEditableTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versionID"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<ListEditableTasksQuery, ListEditableTasksQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const WhoamiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]}}]} as unknown as DocumentNode<WhoamiQuery, WhoamiQueryVariables>;
export const ListPublicSubmissionsForSubmissionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPublicSubmissionsForSubmissionList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPublicSubmissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"evaluation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalScore"}},{"kind":"Field","name":{"kind":"Name","value":"possibleScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"monacoID"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskID"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<ListPublicSubmissionsForSubmissionListQuery, ListPublicSubmissionsForSubmissionListQueryVariables>;
export const ListPublishedTasksForTasksListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPublishedTasksForTasksList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPublishedTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versionID"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListPublishedTasksForTasksListQuery, ListPublishedTasksForTasksListQueryVariables>;
export const ListLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listLanguages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"monacoID"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<ListLanguagesQuery, ListLanguagesQueryVariables>;
export const GetStableTaskVersionByPublishedTaskCodeForTaskViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStableTaskVersionByPublishedTaskCodeForTaskView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTaskByPublishedTaskCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versionID"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeLimitMs"}},{"kind":"Field","name":{"kind":"Name","value":"memoryLimitKb"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetStableTaskVersionByPublishedTaskCodeForTaskViewQuery, GetStableTaskVersionByPublishedTaskCodeForTaskViewQueryVariables>;
export const GetTaskByPublishedTaskCodeForTaskNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaskByPublishedTaskCodeForTaskName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTaskByPublishedTaskCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetTaskByPublishedTaskCodeForTaskNameQuery, GetTaskByPublishedTaskCodeForTaskNameQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;