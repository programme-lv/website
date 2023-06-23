interface RepeatPasswordInputProps {
    password: string
    setPassword: (password: any) => void
}

function RepeatPasswordInput(props: RepeatPasswordInputProps) {
    return (
        <>
            <label htmlFor="repeated-password">Atkārtota parole</label>
            <input type="password" name="repeated-password" id="repeated-password" required
                value={props.password} onChange={(e)=>props.setPassword(e.target.value)} />
        </>
    )
}

export default RepeatPasswordInput;