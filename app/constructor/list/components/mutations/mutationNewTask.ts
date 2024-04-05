import { graphql } from "@/gql";

export const mutationNewTaskGQL = graphql(`
mutation createNewTask($code: String!, $name: String!) {
    createTask(
        code: $code
        name: $name
    ) {
        id
    }
}`);
