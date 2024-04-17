'use server';

import { graphql } from "@/gql";
import { getClient } from "@/lib/RSCApolloClient";

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

export default async function queryTaskDescriptionTaskView(code: string) {
    "use server";
    try {
        const client = getClient();
        const { data } = await client.query({
            query: queryTaskDescriptionGQL,
            variables: { code },
        });

        return data.getTaskByPublishedTaskCode;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/*
query GetStableTaskVersionByPublishedTaskCode {
    getStableTaskVersionByPublishedTaskCode(taskCode: null) {
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
*/