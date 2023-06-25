import NavBar from '@/components/NavBar'
import { useUser } from '@/contexts/UserContext'
import apolloClient from '@/lib/apolloClient';
import { useMutation, gql } from '@apollo/client';

export default function Home() {

	return (
		<main className='p-5'>
			<NavBar />
			<h1>index.tsx</h1>
			<UserData />
			<LogOutButton />
		</main>
	)
}

function UserData() {
	const { userData, loginError } = useUser();
	console.log("index.tsx useUser data:", userData);
	console.log("index.tsx useUser error:", loginError);
	if (loginError) return <div>failed to login</div>
	if (!userData) return <div>authenticating...</div>
	return (
		<div>
			<div>
				<span>username:</span>
				<span>{userData.username}</span>
			</div>
			<div>
				<span>id:</span>
				<span>{userData.id}</span>
			</div>
			<div>{JSON.stringify(userData)}</div>
		</div>
	)
}

const LOGOUT_MUTATION = gql`
mutation Logout {
	logout
}
`;

function LogOutButton() {
	const { refreshUser } = useUser();
	const [logout, { data }] = useMutation(LOGOUT_MUTATION, { client: apolloClient });

	async function handleLogout() {
		await logout();
		await refreshUser();
	}

	return (
		<button onClick={handleLogout}>Log Out</button>
	)
}