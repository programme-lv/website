import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";

const queryListEditableTasksGQL = graphql(`
query ListEditableTasks {
    listEditableTasks {
        id
        updatedAt
        code
        name
    }
}`);

export default async function queryListEditableTasks() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListEditableTasksGQL,
    });

    return data.listEditableTasks;
}