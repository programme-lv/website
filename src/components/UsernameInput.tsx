interface UsernameInputProps {
	username: string
	setUsername: (username: any) => void
}

function UsernameInput(props: UsernameInputProps) {
	return (
		<>
			<label htmlFor="username">Lietotājvārds</label>
			<input type="text" name="username" id="username" required
				value={props.username} onChange={props.setUsername} />
		</>
	)
}

export default UsernameInput;