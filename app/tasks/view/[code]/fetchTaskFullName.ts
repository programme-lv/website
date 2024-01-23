import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

const queryTaskName = gql`
    query GetPublishedTaskVersionByCode($code: String!){
        getPublishedTaskVersionByCode(code: $code) {
            name
        }
    }
`;

export default async function fetchTaskFullName(code: string): string {
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