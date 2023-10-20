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

export type Example = {
  __typename?: 'Example';
  id: Scalars['ID']['output'];
  input: Scalars['String']['output'];
  output: Scalars['String']['output'];
};

export type ExecutionResult = {
  __typename?: 'ExecutionResult';
  stderr: Scalars['String']['output'];
  stdout: Scalars['String']['output'];
};

export type Language = {
  __typename?: 'Language';
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  monacoID: Scalars['ID']['output'];
};

export type Metadata = {
  __typename?: 'Metadata';
  authors?: Maybe<Array<Scalars['String']['output']>>;
  origin?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTask: Task;
  deleteTask: Task;
  enqueueSubmission: Submission;
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


export type MutationEnqueueSubmissionArgs = {
  code: Scalars['String']['input'];
  languageID: Scalars['ID']['input'];
  taskID: Scalars['ID']['input'];
  versionID?: InputMaybe<Scalars['ID']['input']>;
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

export type Query = {
  __typename?: 'Query';
  getCurrentTaskVersionById: Task;
  getPublishedTaskVersionByCode: Task;
  listEditableTasks: Array<Task>;
  listLanguages: Array<Language>;
  listPublishedTasks: Array<Task>;
  listSubmissions: Array<Submission>;
  whoami?: Maybe<User>;
};


export type QueryGetCurrentTaskVersionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPublishedTaskVersionByCodeArgs = {
  code: Scalars['String']['input'];
};

export type Submission = {
  __typename?: 'Submission';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  language: Language;
  task: Task;
};

export type Task = {
  __typename?: 'Task';
  code: Scalars['String']['output'];
  constraints: Constraints;
  createdAt: Scalars['String']['output'];
  description: Description;
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


export type ListLanguagesQuery = { __typename?: 'Query', listLanguages: Array<{ __typename?: 'Language', id: string, fullName: string, monacoID: string }> };

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

export type ListPublishedTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPublishedTasksQuery = { __typename?: 'Query', listPublishedTasks: Array<{ __typename?: 'Task', id: string, code: string, name: string, createdAt: string, updatedAt: string, description: { __typename?: 'Description', id: string, story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', id: string, input: string, output: string }> | null }, constraints: { __typename?: 'Constraints', timeLimitMs: number, memoryLimitKb: number }, metadata: { __typename?: 'Metadata', authors?: Array<string> | null, origin?: string | null }, tests: Array<{ __typename?: 'Test', id: string, name: string, input: string, answer: string }> }> };

export type GetPublishedTaskVersionByCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetPublishedTaskVersionByCodeQuery = { __typename?: 'Query', getPublishedTaskVersionByCode: { __typename?: 'Task', id: string, code: string, name: string, createdAt: string, updatedAt: string, description: { __typename?: 'Description', id: string, story: string, input: string, output: string, notes?: string | null, examples?: Array<{ __typename?: 'Example', id: string, input: string, output: string }> | null }, constraints: { __typename?: 'Constraints', timeLimitMs: number, memoryLimitKb: number }, metadata: { __typename?: 'Metadata', authors?: Array<string> | null, origin?: string | null }, tests: Array<{ __typename?: 'Test', id: string, name: string, input: string, answer: string }> } };


export const CreateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const WhoamiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<WhoamiQuery, WhoamiQueryVariables>;
export const ExecuteCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"languageID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageID"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stdout"}},{"kind":"Field","name":{"kind":"Name","value":"stderr"}}]}}]}}]} as unknown as DocumentNode<ExecuteCodeMutation, ExecuteCodeMutationVariables>;
export const ListLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"monacoID"}}]}}]}}]} as unknown as DocumentNode<ListLanguagesQuery, ListLanguagesQueryVariables>;
export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Authenticate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<AuthenticateQuery, AuthenticateQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ListPublishedTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPublishedTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPublishedTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeLimitMs"}},{"kind":"Field","name":{"kind":"Name","value":"memoryLimitKb"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}}]}}]} as unknown as DocumentNode<ListPublishedTasksQuery, ListPublishedTasksQueryVariables>;
export const GetPublishedTaskVersionByCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublishedTaskVersionByCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublishedTaskVersionByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"story"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"examples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"output"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"constraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeLimitMs"}},{"kind":"Field","name":{"kind":"Name","value":"memoryLimitKb"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}}]}}]} as unknown as DocumentNode<GetPublishedTaskVersionByCodeQuery, GetPublishedTaskVersionByCodeQueryVariables>;