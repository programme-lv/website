import { graphql } from "@/gql";

export const registerGQL = graphql(`
mutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {
    register(
        username: $username
        password: $password
        email: $email
        firstName: $firstName
        lastName: $lastName
    ) {
        username
        id
    }
}`);