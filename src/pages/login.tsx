import NavBar from '@/components/NavBar'
import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, gql, ApolloError } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export default function Login() {
	return (
		<main className='p-5'>
			<NavBar active='login'/>
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
	const { t } = useTranslation('errors')
	const { userData, loginError, refreshUser } = useUser();
	const [login, { data }] = useMutation(LOGIN_MUTATION, { client: apolloClient });
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
			await refreshUser();
			router.push('/');
		} catch (error: ApolloError | any) {
			if (error.message) {
				setError(error.message)
			} else {
				setError('Nezināma kļūda')
			}
		}
		setLoggingIn(false);
	}

	return (
		<form className='flex flex-col border border-gray-400 rounded p-5 my-5 max-w-md' onSubmit={handleLogin}>
				<UsernameInput username={username} setUsername={setUsername} />
				<PasswordInput password={password} setPassword={setPassword} />
				<button disabled={loggingIn} type="submit" className="disabled:opacity-70 rounded self-end p-2 px-12 mt-4 text-sm border max-w-xs bg-blue-600 text-white font-semibold hover:bg-blue-500">
					Pieslēgties
				</button>
				<div className="mt-4">
					Neesi piereģistrējies? <Link href="/register" className="underline text-blue-500 hover:no-underline">Reģistrēties</Link>
				</div>
				{error && <div className="p-2 px-4 bg-red-400 mt-4">
					{t(error)}
				</div>}
		</form>
	)
}
