import PersonIcon from '@mui/icons-material/Person';

interface UsernameInputProps {
	username: string
	setUsername: (username: any) => void
}

function UsernameInput(props: UsernameInputProps) {
	return (
		<div className="flex flex-col gap-1 my-2">
			<label htmlFor="username">Lietotājvārds</label>
			<div className="flex flex-grow items-center w-full border border-gray-400">
				<input type="text" placeholder="jūsu lietotājvārds" name="username" id="username" required className="p-2  flex-grow"
					value={props.username} onChange={(e) => props.setUsername(e.target.value)} />
			</div>

		</div>
	)
}

export default UsernameInput;