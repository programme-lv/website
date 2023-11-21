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
  id: Scalars['ID']['output'];
  input: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  output: Scalars['String']['output'];
  story: Scalars['String']['output'];
};

export type Evaluation = {
  __typename?: 'Evaluation';
  id: Scalars['ID']['output'];
  maxMemoryKb?: Maybe<Scalars['Int']['output']>;
  maxTimeMs?: Maybe<Scalars['Int']['output']>;
  possibleScore?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  testVerdictStatistics: Array<TestVerdictStatistic>;
  totalMemoryKb?: Maybe<Scalars['Int']['output']>;
  totalScore: Scalars['Int']['output'];
  totalTimeMs?: Maybe<Scalars['Int']['output']>;
};

export type Example = {
  __typename?: 'Example';
  answer: Scalars['String']['output'];
  id: Scalars['ID']['output'];
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
   * The code is used to access the task via url like /task/:code.
   * Currently only admins can create tasks.
   * A default task version is assigned to the task.
   */
  createTask: Task;
  deleteTask: Task;
  enqueueSubmissionForPublishedTaskVersion: Submission;
  executeCode: ExecutionResult;
  login: User;
  logout: Scalars['Boolean']['output'];
  publishTask: Task;
  register: User;
  updateTaskConstraints: Task;
  updateTaskDescription: Task;
  updateTaskExamples: Task;
  updateTaskMetadata: Task;
};


export type MutationCreateTaskArgs = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnqueueSubmissionForPublishedTaskVersionArgs = {
  languageID: Scalars['ID']['input'];
  submissionCode: Scalars['String']['input'];
  taskID: Scalars['ID']['input'];
};


export type MutationExecuteCodeArgs = {
  code: Scalars['String']['input'];
  languageID: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationPublishTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateTaskConstraintsArgs = {
  id: Scalars['ID']['input'];
  memoryLimitKB?: InputMaybe<Scalars['Int']['input']>;
  timeLimitMs?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateTaskDescriptionArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  input?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  output?: InputMaybe<Scalars['String']['input']>;
  story?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateTaskExamplesArgs = {
  id: Scalars['ID']['input'];
  inputs?: InputMaybe<Array<Scalars['String']['input']>>;
  outputs?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationUpdateTaskMetadataArgs = {
  authors?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  origin?: InputMaybe<Scalars['String']['input']>;
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
  /**
   * Returns the latest version of a task.
   * Used for task preparation / development / editing.
   */
  getCurrentTaskVersionById: Task;
  /**
   * Returns the latest published version / snapshot of a task.
   * Used when accessing url like /task/:code.
   */
  getPublishedTaskVersionByCode: Task;
  /**
   * Returns a list of all tasks that are editable by the current user.
   * Used for rendering the editable task list in user profile.
   */
  listEditableTasks: Array<Task>;
  listLanguages: Array<ProgrammingLanguage>;
  /**
   * Returns all visible (not hidden) submissions for tasks that have a published version.
   * An example of a hidden submission is a submission made by an admin for testing purposes.
   */
  listPublicSubmissions: Array<Submission>;
  /**
   * Returns a list of all tasks that have a published version.
   * Used for rendering the public task view.
   */
  listPublishedTasks: Array<Task>;
  whoami?: Maybe<User>;
};


export type QueryGetCurrentTaskVersionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPublishedTaskVersionByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryListLanguagesArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
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

export type Task = {
  __typename?: 'Task';
  code: Scalars['String']['output'];
  constraints: Constraints;
  createdAt: Scalars['String']['output'];
  description: Description;
  /** The id of the task. Not the task version. */
  id: Scalars['ID']['output'];
  metadata: Metadata;
  name: Scalars['String']['output'];
  tests: Array<Test>;
  updatedAt: Scalars['String']['output'];
};

export type Test = {
  __typename?: 'Test';
  answer: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  input: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type TestVerdictStatistic = {
  __typename?: 'TestVerdictStatistic';
  count: Scalars['Int']['output'];
  verdict: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type CreateTaskMutationVariables = Exact<{
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, code: string, name: string, createdAt: string, updatedAt: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = { __typename?: 'Query', whoami?: { __typename?: 'User', id: string, username: string, email: string, firstName: string, lastName: string } | null };

export type ExecuteCodeMutationVariables = Exact<{
  languageID: Scalars['ID']['input'];
  code: Scalars['String']['input'];
}>;


export type ExecuteCodeMutation = { __typename?: 'Mutation', executeCode: { __typename?: 'ExecutionResult', stdout: string, stderr: string } };

export type ListLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLanguagesQuery = { __typename?: 'Query', listLanguages: Array<{ __typename?: 'ProgrammingLanguage', id: string, fullName: string, monacoID?: string | null }> };

export type AuthenticateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticateQuery = { __typename?: 'Query', whoami?: { __typename?: 'User', id: string, username: string } | null };

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


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: string, username: string } };

export type ListPublicSubmissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPublicSubmissionsQuery = { __typename?: 'Query', listPublicSubmissions: Array<{ __typename?: 'Submission', id: string, submission: string, username: string, createdAt: string, task: { __typename?: 'Task', id: string, code: string, name: string }, language: { __typename?: 'ProgrammingLanguage', id: string, fullName: string }, evaluation: { __typename?: 'Evaluation', id: string, status: string, totalScore: number, possibleScore?: number | null, totalTimeMs?: number | null, maxTimeMs?: number | null, totalMemoryKb?: number | null, maxMemoryKb?: number | null, testVerdictStatistics: Array<{ __typename?: 'TestVerdictStatistic', verdict: string, count: number }> } }> };

export type ListPublishedTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPublishedTasksQuery = { __typename?: 'Query', listPublishedTasks: Array<{ __typename?: 'Task', id: string, code: string, name: string, createdAt: string, updatedAt: string, description: { __typename?: 'Description', id: string, story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', id: string, input: string, answer: string }> | null }, constraints: { __typename?: 'Constraints', timeLimitMs: number, memoryLimitKb: number }, metadata: { __typename?: 'Metadata', authors?: Array<string> | null, origin?: string | null }, tests: Array<{ __typename?: 'Test', id: string, name: string, input: string, answer: string }> }> };

export type EnqueueSubmissionForPublishedTaskVersionMutationVariables = Exact<{
  taskID: Scalars['ID']['input'];
  languageID: Scalars['ID']['input'];
  submissionCode: Scalars['String']['input'];
}>;


export type EnqueueSubmissionForPublishedTaskVersionMutation = { __typename?: 'Mutation', enqueueSubmissionForPublishedTaskVersion: { __typename?: 'Submission', id: string, submission: string, language: { __typename?: 'ProgrammingLanguage', id: string, fullName: string, monacoID?: string | null } } };

export type GetPublishedTaskVersionByCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetPublishedTaskVersionByCodeQuery = { __typename?: 'Query', getPublishedTaskVersionByCode: { __typename?: 'Task', id: string, code: string, name: string, createdAt: string, updatedAt: string, description: { __typename?: 'Description', id: string, story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', id: string, input: string, answer: string }> | null }, constraints: { __typename?: 'Constraints', timeLimitMs: number, memoryLimitKb: number }, metadata: { __typename?: 'Metadata', authors?: Array<string> | null, origin?: string | null }, tests: Array<{ __typename?: 'Test', id: string, name: string, input: string, answer: string }> } };

export type ListLanguagesLolQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLanguagesLolQuery = { __typename?: 'Query', listLanguages: Array<{ __typename?: 'ProgrammingLanguage', id: string, fullName: string, monacoID?: string | null }> };


export const CreateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const WhoamiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<WhoamiQuery, WhoamiQueryVariables>;
export const ExecuteCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"languageID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageID"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stdout"}},{"kind":"Field","name":{"kind":"Name","value":"stderr"}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeMutation, ExecuteCodeMutationVariables>;
export const ListLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"monacoID"}}]}}]}}]} as unknown as DocumentNode<ListLanguagesQuery, ListLanguagesQueryVariables>;
export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Authenticate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<AuthenticateQuery, AuthenticateQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ListPublicSubmissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPublicSubmissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPublicSubmissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"evaluation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalScore"}},{"kind":"Field","name":{"kind":"Name","value":"possibleScore"}},{"kind":"Field","name":{"kind":"Name","value":"totalTimeMs"}},{"kind":"Field","name":{"kind":"Name","value":"maxTimeMs"}},{"kind":"Field","name":{"kind":"Name","value":"totalMemoryKb"}},{"kind":"Field","name":{"kind":"Name","value":"maxMemoryKb"}},{"kind":"Field","name":{"kind":"Name","value":"testVerdictStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"submission"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<ListPublicSubmissionsQuery, ListPublicSubmissionsQueryVariables>;
export const ListPublishedTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPublishedTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPublishedTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeLimitMs"}},{"kind":"Field","name":{"kind":"Name","value":"memoryLimitKb"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}}]}}]} as unknown as DocumentNode<ListPublishedTasksQuery, ListPublishedTasksQueryVariables>;
export const EnqueueSubmissionForPublishedTaskVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnqueueSubmissionForPublishedTaskVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"submissionCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enqueueSubmissionForPublishedTaskVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskID"}}},{"kind":"Argument","name":{"kind":"Name","value":"languageID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageID"}}},{"kind":"Argument","name":{"kind":"Name","value":"submissionCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"submissionCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"submission"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"monacoID"}}]}}]}}]}}]} as unknown as DocumentNode<EnqueueSubmissionForPublishedTaskVersionMutation, EnqueueSubmissionForPublishedTaskVersionMutationVariables>;
export const GetPublishedTaskVersionByCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublishedTaskVersionByCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublishedTaskVersionByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeLimitMs"}},{"kind":"Field","name":{"kind":"Name","value":"memoryLimitKb"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}}]}}]} as unknown as DocumentNode<GetPublishedTaskVersionByCodeQuery, GetPublishedTaskVersionByCodeQueryVariables>;
export const ListLanguagesLolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLanguagesLol"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listLanguages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"monacoID"}}]}}]}}]} as unknown as DocumentNode<ListLanguagesLolQuery, ListLanguagesLolQueryVariables>;