import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";

const queryListPublishedTasksGQL = graphql(`
query ListPublishedTasksForTasksList {
    listPublishedTasks {
        taskID
        createdAt
        stable {
            versionID
            code
            name
            createdAt
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
}
`)

export default async function queryPublishedTasksForTasksList() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListPublishedTasksGQL,
    });

    return data.listPublishedTasks;
}