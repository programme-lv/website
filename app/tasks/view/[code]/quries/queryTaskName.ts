import { getClient } from "@/lib/RSCApolloClient";
import { graphql } from "@/gql";

const queryTaskNameGQL = graphql(`
    query getTaskFullName($code: String!){
        getPublishedTaskVersionByCode(code: $code) {
            name
        }
    }
`);

export default async function queryTaskName(code: string): Promise<string> {
    'use server';

    const client = getClient();
    const { data } = await client.query({
        query: queryTaskNameGQL,
        variables: { code },
    });

    return data.getPublishedTaskVersionByCode.name;
}
