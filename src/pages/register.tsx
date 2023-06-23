import NavBar from '@/components/NavBar'
import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'

export default function Register() {
	return (
		<main className='p-5'>
			<NavBar />
			<h1>register.tsx</h1>
			<RegistrationForm />
		</main>
	)
}

function RegistrationForm() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		console.log('register')
	}

	return (
		<form className='flex flex-col' onSubmit={handleRegistration}>
			<UsernameInput username={username} setUsername={setUsername} />
			<PasswordInput password={password} setPassword={setPassword}/>
			<button type="submit">Reģistrēties</button>
			<div>
				Jau esi piereģistrējies? <Link href="/login">Pieslēgties</Link>
			</div>
		</form>
	)
}
