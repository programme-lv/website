import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation'
import apolloClient from '@/lib/apolloClient';
import PrimaryButton from '@/components/PrimaryButton';
import { useUser } from '@/contexts/UserContext'
import NavigationBar from '@/components/NavigationBar';
import { mutate } from 'swr';

export default function Profile() {
    return (
        <>
            <NavigationBar active='profile' />
            <main>
                <UserData />
            </main>
        </>
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
    const [logout] = useMutation(LOGOUT_MUTATION, { client: apolloClient });

    async function handleLogout() {
        await logout();
        await mutate('whoami');
    }

    return (
        <PrimaryButton text='Iziet' onClick={handleLogout} />
    )
}