interface EmailInputProps {
    email: string
    setEmail: (email: any) => void
}

function EmailInput(props: EmailInputProps) {
    return (
        <>
            <label htmlFor="email">E-pasts</label>
            <input type="email" name="email" id="email" required
                value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
        </>
    )
}

export default EmailInput;
