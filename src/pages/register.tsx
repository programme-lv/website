import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import EmailInput from '@/components/EmailInput'
import FirstNameInput from '@/components/FirstNameInput'
import LastNameInput from '@/components/LastNameInput'
import RepeatPasswordInput from '@/components/RepeatPasswordInput'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import useTranslation from 'next-translate/useTranslation'
import NavigationBar from '@/components/NavigationBar'
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

export default function Register() {
    return (
        <>
            <NavigationBar active='register' />
            <main className="container m-auto">
                <Container maxWidth='sm'>
                    <Card className='my-5 px-5 pb-5' variant='outlined'>
                        <h2 className="text-center font-normal">Sveiks, programmētāj!</h2>
                        <RegistrationForm />
                    </Card>
                </Container>
            </main>
        </>
    )
}


const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {
    register(username: $username, password: $password, email: $email, firstName: $firstName, lastName: $lastName) {
      id
      username
    }
  }
`;


function RegistrationForm() {
    const { t } = useTranslation('errors')

    const [register, { data }] = useMutation(REGISTER_MUTATION, { client: apolloClient });

    const [username, setUsername] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')

    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false);
    const [registering, setRegistering] = useState<boolean>(false);

    async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('');
        setSuccess(false);
        setRegistering(true);

        if (password !== repeatPassword) {
            setError('Paroles nesakrīt!')
            return
        }

        try {
            await register({ variables: { username, password, email, firstName, lastName } })
            setSuccess(true);
        } catch (error: any) {
            setError(error.message ?? 'Nezināma kļūda');
        }

        setRegistering(false);
    }

    return (
        <form className='flex flex-col gap-5' onSubmit={handleRegistration}>
            <UsernameInput username={username} setUsername={setUsername} />
            <EmailInput email={email} setEmail={setEmail} />
            <div className="flex gap-3">
            <FirstNameInput firstname={firstName} setFirstName={setFirstName} />
            <LastNameInput lastname={lastName} setLastName={setLastName} />
            </div>
            <PasswordInput password={password} setPassword={setPassword} />
            <RepeatPasswordInput password={repeatPassword} setPassword={setRepeatPassword} />
            <LoadingButton type='submit' variant='contained' color='primary'
                loading={registering} loadingPosition='end' endIcon={<HowToRegIcon />}>
                Reģistrēties
            </LoadingButton>
            <div className="mt-4">
                Jau esi piereģistrējies? <Link href="/login" className="underline text-blue-500 hover:no-underline">Pieslēgties</Link>
            </div>
            {error &&
                <Alert severity='error'>
                    {t(error)}
                </Alert>
            }
            {success &&
                <Alert severity='success'>
                    <span>Reģistrācija veiksmīga!</span>
                </Alert>
            }
        </form>
    )
}

