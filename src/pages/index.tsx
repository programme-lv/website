import NavBar from '@/components/NavBar'
import { useUser } from '@/contexts/UserContext'
import useTranslation from 'next-translate/useTranslation'

export default function Home() {
	const { userData, loginError } = useUser();
	const { t } = useTranslation('common')

	return (
		<main className='p-5'>
			<NavBar active='index' />

		</main>
	)
}
