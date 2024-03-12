"use server";
import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";
import { cookies } from "next/headers";

const queryGetCurrentTaskVersionGQL = graphql(`
query GetCurrentTaskVersionStatement($code: String!) {
    getCurrentTaskVersionByCode(
        code: $code
    ) {
        description {
            story
            input
            output
            notes
        }
    }
}`);

export default async function queryStatement(code: string) {
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