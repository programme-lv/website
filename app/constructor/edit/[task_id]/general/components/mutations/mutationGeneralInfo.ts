import { graphql } from "@/gql";

export const mutationGeneralInfoGQL = graphql(`
mutation UpdateCurrentTaskVersionNameAndCodeByTaskID ($taskID: ID!, $name: String!, $code: String!) {
    updateCurrentTaskVersionNameAndCodeByTaskID(
        taskID: $taskID
        name: $name
        code: $code
    ) {
        description {
            story
            input
            output
            notes
        }
        name
        code
    }
}
`);


/*
mutation UpdateCurrentTaskVersionNameAndCodeByTaskID {
    updateCurrentTaskVersionNameAndCodeByTaskID(
        taskID: "40"
        name: "summitis2"
        code: "kodits2"
    ) {
        description {
            story
            input
            output
            notes
        }
        name
        code
    }
}
*/