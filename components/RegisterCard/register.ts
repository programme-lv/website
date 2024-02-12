"use server";
import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

const registerGQL = gql`
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
}
`;

export default async function register(username:string, password:string,
    email:string, firstName:string, lastName:string) {
    "use server";
    const client = getClient();
    const { data } = await client.mutate({
        mutation: registerGQL,
        variables: {
            username,
            password,
            email,
            firstName,
            lastName
        }
    });

    return data.register;
}