interface UsernameInputProps {
	username: string
	setUsername: (username: any) => void
}

function UsernameInput(props: UsernameInputProps) {
	return (
		<>
			<label htmlFor="username">Lietotājvārds</label>
			<input type="text" name="username" id="username" required
				value={props.username} onChange={(e)=>props.setUsername(e.target.value)} />
		</>
	)
}

export default UsernameInput;