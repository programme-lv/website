import NavBar from '@/components/NavBar'
import UsernameInput from '@/components/UsernameInput'
import PasswordInput from '@/components/PasswordInput'
import EmailInput from '@/components/EmailInput'
import FirstNameInput from '@/components/FirstNameInput'
import LastNameInput from '@/components/LastNameInput'
import RepeatPasswordInput from '@/components/RepeatPasswordInput'
import { useState } from 'react'
import Link from 'next/link'

export default function Register() {
    return (
        <main className='p-5'>
            <NavBar />
            <h1>register.tsx</h1>
            <RegistrationForm />
        </main>
    )
}

function RegistrationForm() {
    const [username, setUsername] = useState<string>('')
    const [firstname, setFirstName] = useState<string>('')
    const [lastname, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')

    function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log('register')
    }

    return (
        <form className='flex flex-col' onSubmit={handleRegistration}>
            <UsernameInput username={username} setUsername={setUsername} />
            <EmailInput email={email} setEmail={setEmail} />
            <FirstNameInput firstname={firstname} setFirstName={setFirstName} />
            <LastNameInput lastname={lastname} setLastName={setLastName} />
            <PasswordInput password={password} setPassword={setPassword} />
            <RepeatPasswordInput password={repeatPassword} setPassword={setRepeatPassword} />
            <button type="submit">Reģistrēties</button>
            <div>
                Jau esi piereģistrējies? <Link href="/login">Pieslēgties</Link>
            </div>
        </form>
    )
}

