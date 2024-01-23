import { graphql } from "@/gql";
import { getClient } from "@/lib/client";

const queryTaskDescriptionGQL = graphql(`
    query getTaskDescription($code: String!){
        getPublishedTaskVersionByCode(code: $code) {
            id
            code
            name
            createdAt
            updatedAt
            description {
                id
                story
                input
                output
                notes
                examples {
                    id
                    input
                    answer
                }
            }
            constraints {
                timeLimitMs
                memoryLimitKb
            }
            metadata {
                authors
                origin
            }
        }
    }
`);

export default async function queryTaskDescription(code: string) {
    'use server';

    const client = getClient();
    const { data } = await client.query({
        query: queryTaskDescriptionGQL,
        variables: { code },
    });

    return data.getPublishedTaskVersionByCode;
}