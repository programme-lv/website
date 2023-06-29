import NavBar from '@/components/NavBar'
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useUser } from '@/contexts/UserContext'
import apolloClient from '@/lib/apolloClient';
import { useMutation, gql } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link';

export default function Home() {
	const { userData, loginError } = useUser();
	const { t } = useTranslation('common')

	return (
		<main className='p-5'>
			<NavBar active='index' />
			<UserData />
			{loginError &&
				<div className="flex gap-6">
					<Link href='/login'>
						<PrimaryButton text={t("home_login")} />
					</Link>
					<Link href='/register'>
						<SecondaryButton text={t("home_register")} />
					</Link>
				</div>
			}
			<div className="mt-80 flex gap-6">
				<Link lang='en' locale='en' href='/'>
					<button className="p-2 rounded bg-gray-300 ">Switch to english version</button>
				</Link>
				<Link lang='lv' locale='lv' href='/'>
					<button className="p-2 rounded bg-gray-300 ">Pāriet uz latviešu versiju</button>
				</Link>
			</div>
		</main>
	)
}

function UserData() {
	const { userData, loginError } = useUser();
	const { t: tErrors } = useTranslation('errors')
	const { t: tCommon } = useTranslation('common')

	if (loginError) {
		return (
			<div className='flex flex-col border border-gray-400 rounded p-5 my-5 max-w-md'>
				<h1 className='text-2xl font-bold'>{tCommon("home_user_data")}</h1>
				<div className="my-2">
					<strong>{tCommon("home_user_data_error_exclamation")}</strong> {tErrors(loginError.message)}
				</div>
			</div>
		)
	}
	if (!userData) return <div>authenticating...</div>

	return (
		<div className='flex flex-col border border-gray-400 rounded p-5 my-5 max-w-md'>
			<h1 className='text-2xl font-bold'>{tCommon("home_user_data")}</h1>
			<div className="my-2">
				lietotāja id: <strong>{userData.id}</strong>
			</div>
			<div className="my-2">
				lietotājvārds: <strong>{userData.username}</strong>
			</div>
			<div className="my-2">
				vārds: <strong>{userData.firstName}</strong>
			</div>
			<div className="my-2">
				uzvārds: <strong>{userData.lastName}</strong>
			</div>
			<div className="my-2">
				e-pasts: <strong>{userData.email}</strong>
			</div>
			<LogOutButton />
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
		<PrimaryButton text='Iziet' onClick={handleLogout} />
	)
}