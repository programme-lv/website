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
    "\nmutation setGeneralInfo($id: ID!, $code: String!, $name: String!, $authors: [String!], $story: String, $input: String, $output: String, $notes: String) {\n    updateTaskDescription(\n        id: $id\n        code: $code\n        name: $name\n        story: $story\n        input: $input\n        output: $output\n        notes: $notes\n    ) {\n        id\n    }\n    updateTaskMetadata(\n        id: $id\n        authors: $authors\n    ) {\n        id\n    }\n}": types.SetGeneralInfoDocument,
    "\nquery GetCurrentTaskVersionGeneralInfo($code: String!) {\n    getCurrentTaskVersionByCode(\n        code: $code\n    ) {\n        id\n        name\n        code\n        description {\n            story\n            input\n            output\n            notes\n        }\n        metadata {\n            authors\n        }\n        updatedAt\n        createdAt\n    }\n}": types.GetCurrentTaskVersionGeneralInfoDocument,
    "\nmutation setStatement($id: ID!, $code: String, $name: String, $story: String, $input: String, $output: String, $notes: String) {\n    updateTaskDescription(\n        id: $id\n        code: $code\n        name: $name\n        story: $story\n        input: $input\n        output: $output\n        notes: $notes\n    ) {\n        id\n    }\n}": types.SetStatementDocument,
    "\nquery GetCurrentTaskVersionStatement($code: String!) {\n    getCurrentTaskVersionByCode(\n        code: $code\n    ) {\n        id\n        name\n        code\n        description {\n            story\n            input\n            output\n            notes\n        }\n    }\n}": types.GetCurrentTaskVersionStatementDocument,
    "\nquery ListEditableTasks {\n    listEditableTasks {\n        id\n        updatedAt\n        code\n        name\n    }\n}": types.ListEditableTasksDocument,
    "\nquery ListPublicSubmissions {\n    listPublicSubmissions {\n        id\n        task {\n            id\n            code\n            name\n        }\n        language {\n            id\n            fullName\n        }\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n            runtimeStatistics {\n                avgTimeMs\n                maxTimeMs\n                avgMemoryKb\n                maxMemoryKb\n            }\n        }\n        submission\n        username\n        createdAt\n    }\n}": types.ListPublicSubmissionsDocument,
    "\nquery ListLanguages {\n    listLanguages(enabled: true) {\n        id\n        fullName\n        monacoID\n        enabled\n    }\n}": types.ListLanguagesDocument,
    "\n    query getTaskDescription($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            id\n            code\n            name\n            createdAt\n            updatedAt\n            description {\n                id\n                story\n                input\n                output\n                notes\n                examples {\n                    id\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n            metadata {\n                authors\n                origin\n            }\n        }\n    }\n": types.GetTaskDescriptionDocument,
    "\n    query getTaskFullName($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            name\n        }\n    }\n": types.GetTaskFullNameDocument,
    "\nmutation Login($username: String!, $password: String!) {\n    login(\n        username: $username\n        password: $password\n    ) {\n        id\n        username\n    }\n}": types.LoginDocument,
    "\nmutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(\n        username: $username\n        password: $password\n        email: $email\n        firstName: $firstName\n        lastName: $lastName\n    ) {\n        username\n        id\n    }\n}": types.RegisterDocument,
    "\nquery ListPublishedTasks {\n    listPublishedTasks {\n        id\n        createdAt\n        updatedAt\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n        code\n        name\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        solved\n    }\n}": types.ListPublishedTasksDocument,
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
export function graphql(source: "\nmutation setGeneralInfo($id: ID!, $code: String!, $name: String!, $authors: [String!], $story: String, $input: String, $output: String, $notes: String) {\n    updateTaskDescription(\n        id: $id\n        code: $code\n        name: $name\n        story: $story\n        input: $input\n        output: $output\n        notes: $notes\n    ) {\n        id\n    }\n    updateTaskMetadata(\n        id: $id\n        authors: $authors\n    ) {\n        id\n    }\n}"): (typeof documents)["\nmutation setGeneralInfo($id: ID!, $code: String!, $name: String!, $authors: [String!], $story: String, $input: String, $output: String, $notes: String) {\n    updateTaskDescription(\n        id: $id\n        code: $code\n        name: $name\n        story: $story\n        input: $input\n        output: $output\n        notes: $notes\n    ) {\n        id\n    }\n    updateTaskMetadata(\n        id: $id\n        authors: $authors\n    ) {\n        id\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetCurrentTaskVersionGeneralInfo($code: String!) {\n    getCurrentTaskVersionByCode(\n        code: $code\n    ) {\n        id\n        name\n        code\n        description {\n            story\n            input\n            output\n            notes\n        }\n        metadata {\n            authors\n        }\n        updatedAt\n        createdAt\n    }\n}"): (typeof documents)["\nquery GetCurrentTaskVersionGeneralInfo($code: String!) {\n    getCurrentTaskVersionByCode(\n        code: $code\n    ) {\n        id\n        name\n        code\n        description {\n            story\n            input\n            output\n            notes\n        }\n        metadata {\n            authors\n        }\n        updatedAt\n        createdAt\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation setStatement($id: ID!, $code: String, $name: String, $story: String, $input: String, $output: String, $notes: String) {\n    updateTaskDescription(\n        id: $id\n        code: $code\n        name: $name\n        story: $story\n        input: $input\n        output: $output\n        notes: $notes\n    ) {\n        id\n    }\n}"): (typeof documents)["\nmutation setStatement($id: ID!, $code: String, $name: String, $story: String, $input: String, $output: String, $notes: String) {\n    updateTaskDescription(\n        id: $id\n        code: $code\n        name: $name\n        story: $story\n        input: $input\n        output: $output\n        notes: $notes\n    ) {\n        id\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetCurrentTaskVersionStatement($code: String!) {\n    getCurrentTaskVersionByCode(\n        code: $code\n    ) {\n        id\n        name\n        code\n        description {\n            story\n            input\n            output\n            notes\n        }\n    }\n}"): (typeof documents)["\nquery GetCurrentTaskVersionStatement($code: String!) {\n    getCurrentTaskVersionByCode(\n        code: $code\n    ) {\n        id\n        name\n        code\n        description {\n            story\n            input\n            output\n            notes\n        }\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListEditableTasks {\n    listEditableTasks {\n        id\n        updatedAt\n        code\n        name\n    }\n}"): (typeof documents)["\nquery ListEditableTasks {\n    listEditableTasks {\n        id\n        updatedAt\n        code\n        name\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListPublicSubmissions {\n    listPublicSubmissions {\n        id\n        task {\n            id\n            code\n            name\n        }\n        language {\n            id\n            fullName\n        }\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n            runtimeStatistics {\n                avgTimeMs\n                maxTimeMs\n                avgMemoryKb\n                maxMemoryKb\n            }\n        }\n        submission\n        username\n        createdAt\n    }\n}"): (typeof documents)["\nquery ListPublicSubmissions {\n    listPublicSubmissions {\n        id\n        task {\n            id\n            code\n            name\n        }\n        language {\n            id\n            fullName\n        }\n        evaluation {\n            id\n            status\n            totalScore\n            possibleScore\n            runtimeStatistics {\n                avgTimeMs\n                maxTimeMs\n                avgMemoryKb\n                maxMemoryKb\n            }\n        }\n        submission\n        username\n        createdAt\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListLanguages {\n    listLanguages(enabled: true) {\n        id\n        fullName\n        monacoID\n        enabled\n    }\n}"): (typeof documents)["\nquery ListLanguages {\n    listLanguages(enabled: true) {\n        id\n        fullName\n        monacoID\n        enabled\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getTaskDescription($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            id\n            code\n            name\n            createdAt\n            updatedAt\n            description {\n                id\n                story\n                input\n                output\n                notes\n                examples {\n                    id\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n            metadata {\n                authors\n                origin\n            }\n        }\n    }\n"): (typeof documents)["\n    query getTaskDescription($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            id\n            code\n            name\n            createdAt\n            updatedAt\n            description {\n                id\n                story\n                input\n                output\n                notes\n                examples {\n                    id\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n            metadata {\n                authors\n                origin\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getTaskFullName($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            name\n        }\n    }\n"): (typeof documents)["\n    query getTaskFullName($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Login($username: String!, $password: String!) {\n    login(\n        username: $username\n        password: $password\n    ) {\n        id\n        username\n    }\n}"): (typeof documents)["\nmutation Login($username: String!, $password: String!) {\n    login(\n        username: $username\n        password: $password\n    ) {\n        id\n        username\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(\n        username: $username\n        password: $password\n        email: $email\n        firstName: $firstName\n        lastName: $lastName\n    ) {\n        username\n        id\n    }\n}"): (typeof documents)["\nmutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {\n    register(\n        username: $username\n        password: $password\n        email: $email\n        firstName: $firstName\n        lastName: $lastName\n    ) {\n        username\n        id\n    }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListPublishedTasks {\n    listPublishedTasks {\n        id\n        createdAt\n        updatedAt\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n        code\n        name\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        solved\n    }\n}"): (typeof documents)["\nquery ListPublishedTasks {\n    listPublishedTasks {\n        id\n        createdAt\n        updatedAt\n        constraints {\n            timeLimitMs\n            memoryLimitKb\n        }\n        metadata {\n            authors\n            origin\n        }\n        tests {\n            id\n            name\n            input\n            answer\n        }\n        code\n        name\n        description {\n            id\n            story\n            input\n            output\n            notes\n            examples {\n                id\n                input\n                answer\n            }\n        }\n        solved\n    }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;