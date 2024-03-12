"use server";
import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";
import { cookies } from "next/headers";

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
    // console.log(cookies().get('session'));
    const client = getClient();
    const { data } = await client.query({
        query: queryListEditableTasksGQL,
        context: {
            headers: {
                cookie: cookies().toString()
            }
        }
    });

    return data.listEditableTasks;
}