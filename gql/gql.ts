/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nmutation UpdateCurrentTaskVersionNameAndCodeByTaskID ($taskID: ID!, $name: String!, $code: String!) {\n    updateCurrentTaskVersionNameAndCodeByTaskID(\n        taskID: $taskID\n        name: $name\n        code: $code\n    ) {\n        description {\n            story\n            input\n            output\n            notes\n        }\n        name\n        code\n    }\n}\n": types.UpdateCurrentTaskVersionNameAndCodeByTaskIdDocument,
    "\nquery GetTaskByTaskID ($taskID: ID!) {\n    getTaskByTaskID(taskID: $taskID) {\n        taskID\n        createdAt\n        current {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n        }\n    }\n}\n": types.GetTaskByTaskIdDocument,
    "\nmutation UpdateCurrentTaskVersionStatementByTaskID ($taskID: ID!, $statement: StatementInput!) {\n    updateCurrentTaskVersionStatementByTaskID(\n        taskID: $taskID\n        statement: $statement\n    ) {\n        versionID\n        code\n        name\n        createdAt\n        description {\n            story\n            input\n            output\n            notes\n        }\n    }\n}\n": types.UpdateCurrentTaskVersionStatementByTaskIdDocument,
    "\n    mutation CreateTask($name: String!, $code: String!) {\n        createTask(name: $name, code: $code) {\n            taskID\n            createdAt\n            current {\n                versionID\n                code\n                name\n                createdAt\n            }\n        }\n    }\n": types.CreateTaskDocument,
    "\nquery ListEditableTasks {\n    listEditableTasks {\n        taskID\n        createdAt\n        current {\n            versionID\n            code\n            name\n            createdAt\n        }\n    }\n}": types.ListEditableTasksDocument,
    "\nquery ListPublicSubmissionsForSubmissionList {\n    listPublicSubmissions {\n        id\n        username\n        createdAt\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n        }\n        language {\n            id\n            fullName\n            monacoID\n            enabled\n        }\n        task {\n            taskID\n            name\n            code\n        }\n    }\n}\n": types.ListPublicSubmissionsForSubmissionListDocument,
    "\nquery ListPublishedTasksForTasksList {\n    listPublishedTasks {\n        taskID\n        createdAt\n        stable {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n        }\n    }\n}\n": types.ListPublishedTasksForTasksListDocument,
    "\nquery ListLanguages {\n    listLanguages(enabled: true) {\n        id\n        fullName\n        monacoID\n        enabled\n    }\n}": types.ListLanguagesDocument,
    "\nquery GetStableTaskVersionByPublishedTaskCodeForTaskView($code: String!) {\n    getTaskByPublishedTaskCode(code: $code) {\n        taskID\n        createdAt\n        stable {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n        }\n    }\n}\n": types.GetStableTaskVersionByPublishedTaskCodeForTaskViewDocument,
    "\nquery GetTaskByPublishedTaskCodeForTaskName($code: String!) {\n    getTaskByPublishedTaskCode(code: $code) {\n        stable {\n            name\n        }\n    }\n}\n": types.GetTaskByPublishedTaskCodeForTaskNameDocument,
    "\nmutation Login($username: String!, $password: String!) {\n    login(\n        username: $username\n        password: $password\n    ) {\n        id\n        username\n    }\n}": types.LoginDocument,
    "\nmutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(\n        username: $username\n        password: $password\n        email: $email\n        firstName: $firstName\n        lastName: $lastName\n    ) {\n        username\n        id\n    }\n}": types.RegisterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateCurrentTaskVersionNameAndCodeByTaskID ($taskID: ID!, $name: String!, $code: String!) {\n    updateCurrentTaskVersionNameAndCodeByTaskID(\n        taskID: $taskID\n        name: $name\n        code: $code\n    ) {\n        description {\n            story\n            input\n            output\n            notes\n        }\n        name\n        code\n    }\n}\n"): (typeof documents)["\nmutation UpdateCurrentTaskVersionNameAndCodeByTaskID ($taskID: ID!, $name: String!, $code: String!) {\n    updateCurrentTaskVersionNameAndCodeByTaskID(\n        taskID: $taskID\n        name: $name\n        code: $code\n    ) {\n        description {\n            story\n            input\n            output\n            notes\n        }\n        name\n        code\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetTaskByTaskID ($taskID: ID!) {\n    getTaskByTaskID(taskID: $taskID) {\n        taskID\n        createdAt\n        current {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n        }\n    }\n}\n"): (typeof documents)["\nquery GetTaskByTaskID ($taskID: ID!) {\n    getTaskByTaskID(taskID: $taskID) {\n        taskID\n        createdAt\n        current {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateCurrentTaskVersionStatementByTaskID ($taskID: ID!, $statement: StatementInput!) {\n    updateCurrentTaskVersionStatementByTaskID(\n        taskID: $taskID\n        statement: $statement\n    ) {\n        versionID\n        code\n        name\n        createdAt\n        description {\n            story\n            input\n            output\n            notes\n        }\n    }\n}\n"): (typeof documents)["\nmutation UpdateCurrentTaskVersionStatementByTaskID ($taskID: ID!, $statement: StatementInput!) {\n    updateCurrentTaskVersionStatementByTaskID(\n        taskID: $taskID\n        statement: $statement\n    ) {\n        versionID\n        code\n        name\n        createdAt\n        description {\n            story\n            input\n            output\n            notes\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateTask($name: String!, $code: String!) {\n        createTask(name: $name, code: $code) {\n            taskID\n            createdAt\n            current {\n                versionID\n                code\n                name\n                createdAt\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateTask($name: String!, $code: String!) {\n        createTask(name: $name, code: $code) {\n            taskID\n            createdAt\n            current {\n                versionID\n                code\n                name\n                createdAt\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListEditableTasks {\n    listEditableTasks {\n        taskID\n        createdAt\n        current {\n            versionID\n            code\n            name\n            createdAt\n        }\n    }\n}"): (typeof documents)["\nquery ListEditableTasks {\n    listEditableTasks {\n        taskID\n        createdAt\n        current {\n            versionID\n            code\n            name\n            createdAt\n        }\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListPublicSubmissionsForSubmissionList {\n    listPublicSubmissions {\n        id\n        username\n        createdAt\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n        }\n        language {\n            id\n            fullName\n            monacoID\n            enabled\n        }\n        task {\n            taskID\n            name\n            code\n        }\n    }\n}\n"): (typeof documents)["\nquery ListPublicSubmissionsForSubmissionList {\n    listPublicSubmissions {\n        id\n        username\n        createdAt\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n        }\n        language {\n            id\n            fullName\n            monacoID\n            enabled\n        }\n        task {\n            taskID\n            name\n            code\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListPublishedTasksForTasksList {\n    listPublishedTasks {\n        taskID\n        createdAt\n        stable {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n        }\n    }\n}\n"): (typeof documents)["\nquery ListPublishedTasksForTasksList {\n    listPublishedTasks {\n        taskID\n        createdAt\n        stable {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListLanguages {\n    listLanguages(enabled: true) {\n        id\n        fullName\n        monacoID\n        enabled\n    }\n}"): (typeof documents)["\nquery ListLanguages {\n    listLanguages(enabled: true) {\n        id\n        fullName\n        monacoID\n        enabled\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetStableTaskVersionByPublishedTaskCodeForTaskView($code: String!) {\n    getTaskByPublishedTaskCode(code: $code) {\n        taskID\n        createdAt\n        stable {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n        }\n    }\n}\n"): (typeof documents)["\nquery GetStableTaskVersionByPublishedTaskCodeForTaskView($code: String!) {\n    getTaskByPublishedTaskCode(code: $code) {\n        taskID\n        createdAt\n        stable {\n            versionID\n            code\n            name\n            createdAt\n            description {\n                story\n                input\n                output\n                notes\n                examples {\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetTaskByPublishedTaskCodeForTaskName($code: String!) {\n    getTaskByPublishedTaskCode(code: $code) {\n        stable {\n            name\n        }\n    }\n}\n"): (typeof documents)["\nquery GetTaskByPublishedTaskCodeForTaskName($code: String!) {\n    getTaskByPublishedTaskCode(code: $code) {\n        stable {\n            name\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Login($username: String!, $password: String!) {\n    login(\n        username: $username\n        password: $password\n    ) {\n        id\n        username\n    }\n}"): (typeof documents)["\nmutation Login($username: String!, $password: String!) {\n    login(\n        username: $username\n        password: $password\n    ) {\n        id\n        username\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(\n        username: $username\n        password: $password\n        email: $email\n        firstName: $firstName\n        lastName: $lastName\n    ) {\n        username\n        id\n    }\n}"): (typeof documents)["\nmutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(\n        username: $username\n        password: $password\n        email: $email\n        firstName: $firstName\n        lastName: $lastName\n    ) {\n        username\n        id\n    }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;