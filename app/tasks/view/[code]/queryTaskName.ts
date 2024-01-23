import { getClient } from "@/lib/client";
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

/*
query GetPublishedTaskVersionByCode {
    getPublishedTaskVersionByCode(code: "summa") {
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
        tests {
            id
            name
            input
            answer
        }
    }
}

*/