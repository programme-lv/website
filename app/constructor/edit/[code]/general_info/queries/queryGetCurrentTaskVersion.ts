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

export default async function queryGetCurrentTaskVersionByCode(code: string) {
    "use server";
    // console.log(cookies().get('session'));
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