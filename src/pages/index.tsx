import NavBar from '@/components/NavBar'
import { useUser } from '@/contexts/UserContext'

export default function Home() {

	return (
		<main className='p-5'>
			<NavBar />
			<h1>index.tsx</h1>
			<UserData/>
		</main>
	)
}

function UserData() {
	const { userData, loginError } = useUser();
	console.log("index.tsx useUser data:",userData);
	console.log("index.tsx useUser error:",loginError);
	if(loginError) return <div>failed to login</div>
	if(!userData) return <div>authenticating...</div>
	return (
		<>
		<div>
			<span>username:</span>
			<span>{userData.username}</span>
		</div>
		<div>
			<span>id:</span>
			<span>{userData.id}</span>
		</div>
		<div>{JSON.stringify(userData)}</div>
		</>
	)

	
}