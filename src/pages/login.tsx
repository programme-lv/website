import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import NavigationBar from '@/components/NavigationBar';
import { Alert, Card } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Container } from '@mui/system';
import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
    return (
        <div>
            <NavigationBar active='login' />
            <main className="container m-auto">
                <Container maxWidth='sm'>
                    <Card className='my-5 px-5 pb-5' variant='outlined'>
                        <h2 className="text-center font-normal">Sveiks, programmētāj!</h2>
                        {/*<LoginForm />*/}
                    </Card>
                </Container>
            </main>
        </div>
    )
}

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
	login(username: $username, password: $password) {
		id
		username
	}
}
`;

function LoginForm() {
    const { t } = useTranslation('errors')
    const { refreshUser } = useUser();
    const [login] = useMutation(LOGIN_MUTATION, { client: apolloClient });
    const router = useRouter();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loggingIn, setLoggingIn] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoggingIn(true);
        try {
            await login({ variables: { username, password } });
            setSuccess('Pieslēgšanās veiksmīga!');
            refreshUser();
            await router.push('/');
        } catch (error: any) {
            setError(error.message ?? 'Nezināma kļūda')
        }

        setLoggingIn(false);
    }

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <UsernameInput username={username} setUsername={setUsername} />
            <PasswordInput password={password} setPassword={setPassword} />
            <LoadingButton type='submit' variant='contained' color='primary'
                loading={loggingIn} loadingPosition='end' endIcon={<LoginIcon />}>
                Pieslēgties
            </LoadingButton>
            <div className="mt-4">
                Neesi piereģistrējies? <Link href="/register" className="underline text-blue-500 hover:no-underline">Reģistrēties</Link>
            </div>
            {error &&
                <Alert severity='error'>
                    {t(error)}
                </Alert>
            }
            {success &&
                <Alert severity='success'>
                    {t(success)}
                </Alert>
            }
        </form>
    )
}
