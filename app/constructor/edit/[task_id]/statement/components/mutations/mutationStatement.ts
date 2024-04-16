import { graphql } from "@/gql";

export const updateStatementMutationGQL = graphql(`
mutation UpdateCurrentTaskVersionStatementByTaskID ($taskID: ID!, $statement: StatementInput!) {
    updateCurrentTaskVersionStatementByTaskID(
        taskID: $taskID
        statement: $statement
    ) {
        versionID
        code
        name
        createdAt
        description {
            story
            input
            output
            notes
        }
    }
}
`);

/*
mutation UpdateCurrentTaskVersionStatementByTaskID {
    updateCurrentTaskVersionStatementByTaskID(
        taskID: "40"
        statement: { story: "ab", input: "a", output: "a", notes: "a" }
    ) {
        versionID
        code
        name
        createdAt
        description {
            story
            input
            output
            notes
        }
    }
}
*/