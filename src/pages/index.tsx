import NavBar from '@/components/NavBar'
import { useUser } from '@/contexts/UserContext'

export default function Home() {
	const { data, error } = useUser();
	console.log("index.tsx useUser data:",data);
	console.log("index.tsx useUser error:",error);
	return (
		<main className='p-5'>
			<NavBar />
			<h1>index.tsx</h1>
		</main>
	)
}
