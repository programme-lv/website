import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";

const queryListPublicSubmissionsGQL = graphql(`
query ListPublicSubmissionsForSubmissionList {
    listPublicSubmissions {
        id
        submission
        username
        createdAt
        evaluation {
            id
            status
            totalScore
            possibleScore
        }
        language {
            id
            fullName
            monacoID
            enabled
        }
        task {
            taskID
            name
            code
        }
    }
}
`)

export default async function queryPublicSubmissions() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListPublicSubmissionsGQL,
    });

    return data.listPublicSubmissions;
}