import NavBar from '@/components/NavBar'
import { useState } from 'react'

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
		</form>
	)
}

interface UsernameInputProps {
	username: string
	setUsername: (username: any) => void
}

function UsernameInput(props: UsernameInputProps) {
	return (
		<>
			<label htmlFor="username">Lietotājvārds</label>
			<input type="text" name="username" id="username"
				value={props.username} onChange={props.setUsername} />
		</>
	)
}

interface PasswordInputProps {
	password: string
	setPassword: (password: any) => void
}

function PasswordInput(props:PasswordInputProps) {
	return (
		<>
			<label htmlFor="password">Parole</label>
			<input type="password" name="password" id="password" 
				value={props.password} onChange={props.setPassword}/>
		</>
	)
}