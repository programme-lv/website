interface PasswordInputProps {
	password: string
	setPassword: (password: any) => void
}

function PasswordInput(props:PasswordInputProps) {
	return (
		<>
			<label htmlFor="password">Parole</label>
			<input type="password" name="password" id="password" required
				value={props.password} onChange={props.setPassword}/>
		</>
	)
}

export default PasswordInput;