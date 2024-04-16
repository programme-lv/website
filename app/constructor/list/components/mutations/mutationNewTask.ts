import { graphql } from "@/gql";

export const mutationNewTaskGQL = graphql(`
    mutation CreateTask($name: String!, $code: String!) {
        createTask(name: $name, code: $code) {
            taskID
            createdAt
            current {
                versionID
                code
                name
                createdAt
            }
        }
    }
`);

/*
mutation CreateTask {
    createTask(name: "tests", code: "test") {
        taskID
        createdAt
        updatedAt
        current {
            versionID
            code
            name
            createdAt
        }
        stable {
            versionID
            code
            name
            createdAt
        }
    }
}

*/