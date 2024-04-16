"use server";
import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";
import { cookies } from "next/headers";

const queryGetCurrentTaskVersionGQL = graphql(`
query GetCurrentTaskVersionByTaskID($taskID: ID!) {
    getCurrentTaskVersionByTaskID(taskID: $taskID) {
        versionID
        code
        name
        createdAt
        metadata {
            authors
            origin
        }
        constraints {
            timeLimitMs
            memoryLimitKb
        }
        description {
            story
            input
            output
            notes
            examples {
                input
                answer
            }
        }
    }
}

`);

export default async function queryGenralInfo(taskID: string) {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryGetCurrentTaskVersionGQL,
        variables: { taskID },  
        context: {
            headers: {
                cookie: cookies().toString()
            }
        }
    });

    return data.getCurrentTaskVersionByTaskID;
}