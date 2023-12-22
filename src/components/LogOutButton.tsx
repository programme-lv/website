import { Button } from "@mui/material";
import { mutate } from "swr";
import { gql,useMutation } from "@apollo/client";
import apolloClient from '@/lib/apolloClient';
import { useRouter } from "next/router";

const LOGOUT_MUTATION = gql`
mutation Logout {
	logout
}
`;

export default function LogOutButton() {
    const [logout] = useMutation(LOGOUT_MUTATION, { client: apolloClient });
    const router = useRouter();

    async function handleLogout() {
        await logout();
        await router.push('/');
        await mutate('whoami');
    }

    return (
        <Button onClick={handleLogout} variant='contained' color='warning'>Iziet</Button>
    )
}
