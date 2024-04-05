import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";


export const mutationEnqueueSubmissionForPublishedTaskVersion = graphql(`
mutation EnqueueSubmissionForPublishedTaskVersion($taskID: ID!, $languageID: ID!, $submissionCode: String!) {
    enqueueSubmissionForPublishedTaskVersion(
        taskID: $taskID
        languageID: $languageID
        submissionCode: $submissionCode
    ) {
        id
    }
}
`)