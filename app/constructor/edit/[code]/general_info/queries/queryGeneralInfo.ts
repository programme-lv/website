"use server";
import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";
import { cookies } from "next/headers";

const queryGetCurrentTaskVersionGQL = graphql(`
query GetCurrentTaskVersionGeneralInfo($code: String!) {
    getCurrentTaskVersionByCode(
        code: $code
    ) {
        id
        name
        code
        metadata {
            authors
        }
        updatedAt
        createdAt
    }
}`);

export default async function queryGenralInfo(code: string) {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryGetCurrentTaskVersionGQL,
        variables: { code },  
        context: {
            headers: {
                cookie: cookies().toString()
            }
        }
    });

    return data.getCurrentTaskVersionByCode;
}