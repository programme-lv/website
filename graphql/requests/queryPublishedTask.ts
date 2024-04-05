import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";

const queryListPublishedTasksGQL = graphql(`
query ListPublishedTasks {
    listPublishedTasks {
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