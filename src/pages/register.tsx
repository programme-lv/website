import NavBar from '@/components/NavBar'
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

export default function Register() {
    return (
        <main className='p-5'>
            <NavBar />
            <h1>register.tsx</h1>
            <RegistrationForm />
        </main>
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
    const [register, { data }] = useMutation(REGISTER_MUTATION, { client: apolloClient });

    const [username, setUsername] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')

    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(true);

    async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (password !== repeatPassword) {
            setError('Paroles nesakrīt')
            return
        }

        try {
            await register({ variables: { username, password, email, firstName, lastName } })
        } catch (error: any) {
            if (error.message) {
                setError(error.message)
            } else {
                setError('Nezināma kļūda')
            }
            return;
        }

        setSuccess(true);
    }

    if (success) {
        return (<div>
            Reģistrācija veiksmīga!
            <br></br>
            <Link href="/login">Pieslēgties</Link>
        </div>);
    }

    return (
        <form className='flex flex-col' onSubmit={handleRegistration}>
            <UsernameInput username={username} setUsername={setUsername} />
            <EmailInput email={email} setEmail={setEmail} />
            <FirstNameInput firstname={firstName} setFirstName={setFirstName} />
            <LastNameInput lastname={lastName} setLastName={setLastName} />
            <PasswordInput password={password} setPassword={setPassword} />
            <RepeatPasswordInput password={repeatPassword} setPassword={setRepeatPassword} />
            <button type="submit">Reģistrēties</button>
            <div>
                Jau esi piereģistrējies? <Link href="/login">Pieslēgties</Link>
            </div>
            <div>
                {error}
            </div>
        </form>
    )
}

