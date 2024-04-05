import { graphql } from "@/gql";

export const mutationStatementGQL = graphql(`
mutation setStatement($id: ID!, $code: String, $name: String, $story: String, $input: String, $output: String, $notes: String) {
    updateTaskDescription(
        id: $id
        code: $code
        name: $name
        story: $story
        input: $input
        output: $output
        notes: $notes
    ) {
        code
    }
}`);
