import { getClient } from "@/lib/RSCApolloClient";
import { graphql } from "@/gql";

const queryTaskNameGQL = graphql(`
query GetTaskByPublishedTaskCodeForTaskName($code: String!) {
    getTaskByPublishedTaskCode(code: $code) {
        stable {
            name
        }
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

    return data.getTaskByPublishedTaskCode?.stable?.name ?? '';
}

/*
const queryTaskDescriptionGQL = graphql(`
query GetStableTaskVersionByPublishedTaskCodeForTaskView($code: String!) {
    getTaskByPublishedTaskCode(code: $code) {
        taskID
        createdAt
        stable {
            versionID
            code
            name
            createdAt
            description {
                story
                input
                output
                notes
                examples {
                    input
                    answer
                }
            }
            constraints {
                timeLimitMs
                memoryLimitKb
            }
        }
    }
}
`);
*/