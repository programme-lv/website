import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";

const queryListPublicSubmissionsGQL = graphql(`
`)

export default async function queryPublicSubmissions() {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryListPublicSubmissionsGQL,
    });

    return data.listPublicSubmissions;
}