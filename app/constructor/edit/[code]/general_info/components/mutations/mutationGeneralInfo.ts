import { graphql } from "@/gql";

export const mutationGeneralInfoGQL = graphql(`
mutation setGeneralInfo($id: ID!, $code: String!, $name: String!, $authors: [String!], $story: String, $input: String, $output: String, $notes: String) {
    updateTaskDescription(
        id: $id
        code: $code
        name: $name
        story: $story
        input: $input
        output: $output
        notes: $notes
    ) {
        id
    }
    updateTaskMetadata(
        id: $id
        authors: $authors
    ) {
        id
    }
}`);
