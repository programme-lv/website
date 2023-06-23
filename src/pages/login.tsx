import NavBar from '@/components/NavBar'
import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
	return (
		<main className='p-5'>
			<NavBar />
			<h1>login.tsx</h1>
			<LoginForm />
		</main>
	)
}

function LoginForm() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		console.log('login')
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
