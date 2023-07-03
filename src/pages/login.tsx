import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import NavigationBar from '@/components/NavigationBar';
import { Button, Card } from '@mui/material';
import { Container } from '@mui/system';

export default function Login() {
	return (
		<div>
			<NavigationBar active='login' />
			<main className="container m-auto">
                <Container maxWidth='sm'>
                <Card className='my-5 p-5' variant='outlined'>
				<LoginForm />
                </Card>
                </Container>
			</main>
		</div>
	)
}

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
	login(username: $username, password: $password) {
		id
		username
	}
}
`;

function LoginForm() {
	const { t } = useTranslation('errors')
	const { refreshUser } = useUser();
	const [login] = useMutation(LOGIN_MUTATION, { client: apolloClient });
	const router = useRouter();

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [loggingIn, setLoggingIn] = useState(false)
	const [error, setError] = useState('')

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');
		setLoggingIn(true);
		try {
			await login({ variables: { username, password } });
			
            refreshUser();
			router.push('/');
		} catch (error: any) {
            setError(error.message ?? 'Nezināma kļūda')
		}

		setLoggingIn(false);
	}

	return (
		<form onSubmit={handleLogin} className="flex flex-col gap-5">
			<UsernameInput username={username} setUsername={setUsername} />
			<PasswordInput password={password} setPassword={setPassword} />
            <Button type='submit' variant='contained' color='primary'>Pieslēgties</Button>
			<div className="mt-4">
				Neesi piereģistrējies? <Link href="/register" className="underline text-blue-500 hover:no-underline">Reģistrēties</Link>
			</div>
			{error && <div className="p-2 px-4 bg-red-400 mt-4">
				{t(error)}
			</div>}
		</form>
	)
}
