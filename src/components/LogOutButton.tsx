import { Button } from "@mui/material";
import { mutate } from "swr";
import { gql,useMutation } from "@apollo/client";
import apolloClient from '@/lib/apolloClient';

const LOGOUT_MUTATION = gql`
mutation Logout {
	logout
}
`;

export default function LogOutButton() {
    const [logout] = useMutation(LOGOUT_MUTATION, { client: apolloClient });

    async function handleLogout() {
        await logout();
        await mutate('whoami');
    }

    return (
        <Button onClick={handleLogout} variant='contained' color='warning'>Iziet</Button>
    )
}
