import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	return (
		<main className={`p-5 ${inter.className}`}>
			<NavBar />
		</main>
	)
}
