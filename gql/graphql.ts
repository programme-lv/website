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

export type CompilationDetails = {
  __typename?: 'CompilationDetails';
  exitCode: Scalars['Int']['output'];
  memoryKb: Scalars['Int']['output'];
  stderr: Scalars['String']['output'];
  stdout: Scalars['String']['output'];
  timeMs: Scalars['Int']['output'];
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
  /** Some programming languages do not support compilation, so this field may be null. */
  compilation?: Maybe<CompilationDetails>;
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
  getSubmission: Submission;
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


export type QueryGetSubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListLanguagesArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RuntimeStatistics = {
  __typename?: 'RuntimeStatistics';
  avgMemoryKb: Scalars['Int']['output'];
  avgTimeMs: Scalars['Int']['output'];
  maxMemoryKb: Scalars['Int']['output'];
  maxTimeMs: Scalars['Int']['output'];
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
  solved?: Maybe<Scalars['Boolean']['output']>;
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

export type TestResult = {
  __typename?: 'TestResult';
  memoryKb: Scalars['Int']['output'];
  result: TestResultType;
  timeMs: Scalars['Int']['output'];
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

export type GetPublishedTaskVersionByCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetPublishedTaskVersionByCodeQuery = { __typename?: 'Query', getPublishedTaskVersionByCode: { __typename?: 'Task', name: string } };


export const GetPublishedTaskVersionByCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublishedTaskVersionByCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublishedTaskVersionByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetPublishedTaskVersionByCodeQuery, GetPublishedTaskVersionByCodeQueryVariables>;