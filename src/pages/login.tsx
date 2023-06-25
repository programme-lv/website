import NavBar from '@/components/NavBar'
import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, gql, ApolloError } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/router'

export default function Login() {
	return (
		<main className='p-5'>
			<NavBar />
			<h1>login.tsx</h1>
			<LoginForm />
		</main>
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
	const { userData, loginError, refreshUser } = useUser();
	const [login, { data }] = useMutation(LOGIN_MUTATION, { client: apolloClient });
	const router = useRouter();

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState('')

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			await login({ variables: { username, password } });
			await refreshUser();
			router.push('/');
		} catch (error: ApolloError | any) {
			if (error.message) {
				setError(error.message)
			} else {
				setError('Nezināma kļūda')
			}
			return;
		}
	}

	return (
		<form className='flex flex-col' onSubmit={handleLogin}>
			<UsernameInput username={username} setUsername={setUsername} />
			<PasswordInput password={password} setPassword={setPassword} />
			<button type="submit">Pieslēgties</button>
			<div>
				Neesi piereģistrējies? <Link href="/register">Reģistrēties</Link>
			</div>
			<div>
				{error}
			</div>
		</form>
	)
}
