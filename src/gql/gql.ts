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
    "\nmutation CreateTask($name: String!, $code: String!){\n    createTask(name: $name, code: $code) {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n    }\n}\n": types.CreateTaskDocument,
    "\nmutation Logout {\n\tlogout\n}\n": types.LogoutDocument,
    "\nquery Whoami {\n  whoami {\n    id\n    username\n    email\n    firstName\n    lastName\n  }\n}\n": types.WhoamiDocument,
    "\nmutation ExecuteCode($languageID: ID!, $code: String!) {\n    executeCode(languageID: $languageID, code: $code ){\n        stdout\n        stderr\n    }\n}\n": types.ExecuteCodeDocument,
    "\nquery ListLanguages {\n    listLanguages {\n        id\n        fullName\n        monacoID\n    }\n}\n": types.ListLanguagesDocument,
    "\nquery Authenticate {\n    whoami {\n        id\n        username\n    }\n}\n": types.AuthenticateDocument,
    "\nmutation Login($username: String!, $password: String!) {\n\tlogin(username: $username, password: $password) {\n\t\tid\n\t\tusername\n\t}\n}\n": types.LoginDocument,
    "\n  mutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(username: $username, password: $password, email: $email, firstName: $firstName, lastName: $lastName) {\n      id\n      username\n    }\n  }\n": types.RegisterDocument,
    "\nmutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n        id\n        username\n    }\n}\n": types.LoginDocument,
    "\nquery ListPublicSubmissions {\n    listPublicSubmissions {\n        id\n        task {\n            id\n            code\n            name\n        }\n        language {\n            id\n            fullName\n        }\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n        }\n        submission\n        username\n        createdAt\n    }\n}\n": types.ListPublicSubmissionsDocument,
    "\nquery ListPublishedTasks {\n    listPublishedTasks {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n    }\n}\n": types.ListPublishedTasksDocument,
    "\nmutation EnqueueSubmissionForPublishedTaskVersion($taskID: ID!, $languageID: ID!, $submissionCode: String!) {\n    enqueueSubmissionForPublishedTaskVersion(\n        taskID: $taskID\n        languageID: $languageID\n        submissionCode: $submissionCode\n    ) {\n        id\n        submission\n        language {\n            id\n            fullName\n            monacoID\n        }\n    }\n}\n": types.EnqueueSubmissionForPublishedTaskVersionDocument,
    "\nquery GetPublishedTaskVersionByCode($code: String!) {\n    getPublishedTaskVersionByCode(code: $code) {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n    }\n}": types.GetPublishedTaskVersionByCodeDocument,
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
export function graphql(source: "\nmutation CreateTask($name: String!, $code: String!){\n    createTask(name: $name, code: $code) {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n    }\n}\n"): (typeof documents)["\nmutation CreateTask($name: String!, $code: String!){\n    createTask(name: $name, code: $code) {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Logout {\n\tlogout\n}\n"): (typeof documents)["\nmutation Logout {\n\tlogout\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Whoami {\n  whoami {\n    id\n    username\n    email\n    firstName\n    lastName\n  }\n}\n"): (typeof documents)["\nquery Whoami {\n  whoami {\n    id\n    username\n    email\n    firstName\n    lastName\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation ExecuteCode($languageID: ID!, $code: String!) {\n    executeCode(languageID: $languageID, code: $code ){\n        stdout\n        stderr\n    }\n}\n"): (typeof documents)["\nmutation ExecuteCode($languageID: ID!, $code: String!) {\n    executeCode(languageID: $languageID, code: $code ){\n        stdout\n        stderr\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListLanguages {\n    listLanguages {\n        id\n        fullName\n        monacoID\n    }\n}\n"): (typeof documents)["\nquery ListLanguages {\n    listLanguages {\n        id\n        fullName\n        monacoID\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Authenticate {\n    whoami {\n        id\n        username\n    }\n}\n"): (typeof documents)["\nquery Authenticate {\n    whoami {\n        id\n        username\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Login($username: String!, $password: String!) {\n\tlogin(username: $username, password: $password) {\n\t\tid\n\t\tusername\n\t}\n}\n"): (typeof documents)["\nmutation Login($username: String!, $password: String!) {\n\tlogin(username: $username, password: $password) {\n\t\tid\n\t\tusername\n\t}\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(username: $username, password: $password, email: $email, firstName: $firstName, lastName: $lastName) {\n      id\n      username\n    }\n  }\n"): (typeof documents)["\n  mutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(username: $username, password: $password, email: $email, firstName: $firstName, lastName: $lastName) {\n      id\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n        id\n        username\n    }\n}\n"): (typeof documents)["\nmutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n        id\n        username\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListPublicSubmissions {\n    listPublicSubmissions {\n        id\n        task {\n            id\n            code\n            name\n        }\n        language {\n            id\n            fullName\n        }\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n        }\n        submission\n        username\n        createdAt\n    }\n}\n"): (typeof documents)["\nquery ListPublicSubmissions {\n    listPublicSubmissions {\n        id\n        task {\n            id\n            code\n            name\n        }\n        language {\n            id\n            fullName\n        }\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n        }\n        submission\n        username\n        createdAt\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListPublishedTasks {\n    listPublishedTasks {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n    }\n}\n"): (typeof documents)["\nquery ListPublishedTasks {\n    listPublishedTasks {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation EnqueueSubmissionForPublishedTaskVersion($taskID: ID!, $languageID: ID!, $submissionCode: String!) {\n    enqueueSubmissionForPublishedTaskVersion(\n        taskID: $taskID\n        languageID: $languageID\n        submissionCode: $submissionCode\n    ) {\n        id\n        submission\n        language {\n            id\n            fullName\n            monacoID\n        }\n    }\n}\n"): (typeof documents)["\nmutation EnqueueSubmissionForPublishedTaskVersion($taskID: ID!, $languageID: ID!, $submissionCode: String!) {\n    enqueueSubmissionForPublishedTaskVersion(\n        taskID: $taskID\n        languageID: $languageID\n        submissionCode: $submissionCode\n    ) {\n        id\n        submission\n        language {\n            id\n            fullName\n            monacoID\n        }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetPublishedTaskVersionByCode($code: String!) {\n    getPublishedTaskVersionByCode(code: $code) {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n    }\n}"): (typeof documents)["\nquery GetPublishedTaskVersionByCode($code: String!) {\n    getPublishedTaskVersionByCode(code: $code) {\n        id\n        code\n        name\n        createdAt\n        updatedAt\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n    }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;