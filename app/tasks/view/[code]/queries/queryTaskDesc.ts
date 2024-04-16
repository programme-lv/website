'use server';

import { graphql } from "@/gql";
import { getClient } from "@/lib/RSCApolloClient";

const queryTaskDescriptionGQL = graphql(`
`);

export default async function queryTaskDescription(code: string) {
    "use server";
    const client = getClient();
    const { data } = await client.query({
        query: queryTaskDescriptionGQL,
        variables: { code },
    });

    return data.getPublishedTaskVersionByCode;
}