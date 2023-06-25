import NavBar from '@/components/NavBar'
import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';

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
mutation Login {
    login(username: "labdien", password: "labdien1") {
        id
        username
    }
}
`;

function LoginForm() {
	const [login, { data }] = useMutation(LOGIN_MUTATION, { client: apolloClient });

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let response = await login({variables: {username, password}});
		console.log(response);
	}

	return (
		<form className='flex flex-col' onSubmit={handleLogin}>
			<UsernameInput username={username} setUsername={setUsername} />
			<PasswordInput password={password} setPassword={setPassword}/>
			<button type="submit">Pieslēgties</button>
			<div>
				Neesi piereģistrējies? <Link href="/register">Reģistrēties</Link>
			</div>
		</form>
	)
}
