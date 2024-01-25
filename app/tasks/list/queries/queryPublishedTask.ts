import { graphql } from "@/gql"
import { getClient } from "@/lib/client";

const queryListPublishedTasksGQL = graphql(`
query ListPublishedTasks {
    listPublishedTasks {
        id
        createdAt
        updatedAt
        constraints {
            timeLimitMs
            memoryLimitKb
        }
        metadata {
            authors
            origin
        }
        tests {
            id
            name
            input
            answer
        }
        code
        name
        description {
            id
            story
            input
            output
            notes
            examples {
                id
                input
                answer
            }
        }
        solved
    }
}`)

export default async function queryPublishedTasks() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListPublishedTasksGQL,
    });

    return data.listPublishedTasks;
}