"use server";
import { graphql } from "@/gql"
import { getClient } from "@/lib/RSCApolloClient";
import { cookies } from "next/headers";

const queryGetTaskByTaskIDGQL = graphql(`
query GetTaskByTaskID ($taskID: ID!) {
    getTaskByTaskID(taskID: $taskID) {
        taskID
        createdAt
        current {
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

export default async function queryGeneralInfo(taskID: string) {
    console.log("taskID", taskID)
    try {
    const client = getClient();
    const { data, errors } = await client.query({
        query: queryGetTaskByTaskIDGQL,
        variables: { taskID }, // Now correctly passing taskID as a variable
        context: {
            headers: {
                cookie: cookies().toString()
            }
        }
    });

    if (errors) {
        console.error("Errors while fetching task data:", errors);
    }

    return data.getTaskByTaskID;
    }catch(e){
        console.error(e);
        console.error(JSON.stringify(e));
    }
}
