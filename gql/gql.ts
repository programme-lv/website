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
    "\n    query getTaskDescription($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            id\n            code\n            name\n            createdAt\n            updatedAt\n            description {\n                id\n                story\n                input\n                output\n                notes\n                examples {\n                    id\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n            metadata {\n                authors\n                origin\n            }\n        }\n    }\n": types.GetTaskDescriptionDocument,
    "\n    query getTaskFullName($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            name\n        }\n    }\n": types.GetTaskFullNameDocument,
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
export function graphql(source: "\n    query getTaskDescription($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            id\n            code\n            name\n            createdAt\n            updatedAt\n            description {\n                id\n                story\n                input\n                output\n                notes\n                examples {\n                    id\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n            metadata {\n                authors\n                origin\n            }\n        }\n    }\n"): (typeof documents)["\n    query getTaskDescription($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            id\n            code\n            name\n            createdAt\n            updatedAt\n            description {\n                id\n                story\n                input\n                output\n                notes\n                examples {\n                    id\n                    input\n                    answer\n                }\n            }\n            constraints {\n                timeLimitMs\n                memoryLimitKb\n            }\n            metadata {\n                authors\n                origin\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getTaskFullName($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            name\n        }\n    }\n"): (typeof documents)["\n    query getTaskFullName($code: String!){\n        getPublishedTaskVersionByCode(code: $code) {\n            name\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;