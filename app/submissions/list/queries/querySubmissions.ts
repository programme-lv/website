import { graphql } from "@/gql"
import { getClient } from "@/lib/client";

const queryListPublicSubmissionsGQL = graphql(`
query ListPublicSubmissions {
    listPublicSubmissions {
        id
        task {
            id
            code
            name
        }
        language {
            id
            fullName
        }
        evaluation {
            id
            status
            totalScore
            possibleScore
            runtimeStatistics {
                avgTimeMs
                maxTimeMs
                avgMemoryKb
                maxMemoryKb
            }
        }
        submission
        username
        createdAt
    }
}`)

export default async function queryPublicSubmissions() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListPublicSubmissionsGQL,
    });

    return data.listPublicSubmissions;
}