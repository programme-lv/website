import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";

const queryListPublishedTasksGQL = graphql(`
`)

export default async function queryPublishedTasks() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListPublishedTasksGQL,
    });

    return data.listPublishedTasks;
}