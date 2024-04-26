import { graphql } from "@/gql";

export const loginGQL = graphql(`
mutation Login($username: String!, $password: String!) {
    login(
        username: $username
        password: $password
    ) {
        id
        username
        email
        firstName
        lastName
        isAdmin
    }
}`);
