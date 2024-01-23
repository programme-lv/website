import { getClient } from "@/lib/client";
import { graphql } from "@/gql";

const queryTaskName = graphql(`
    query GetPublishedTaskVersionByCode($code: String!){
        getPublishedTaskVersionByCode(code: $code) {
            name
        }
    }
`);

export default async function fetchTaskFullName(code: string): Promise<string> {
    'use server';

    const client = getClient();
    const { data } = await client.query({
        query: queryTaskName,
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