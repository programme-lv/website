import PersonIcon from '@mui/icons-material/Person';

interface UsernameInputProps {
	username: string
	setUsername: (username: any) => void
}

function UsernameInput(props: UsernameInputProps) {
	return (
		<div className="flex flex-col gap-1 my-2">
			<label htmlFor="username">Lietotājvārds</label>
			<div className="flex flex-grow items-center w-full">
				<input type="text" placeholder="jūsu lietotājvārds" name="username" id="username" required className="border p-2 border-gray-400 flex-grow"
					value={props.username} onChange={(e) => props.setUsername(e.target.value)} />
				<div className="rounded-l-none py-2 px-3 bg-gray-300">
					<PersonIcon />
				</div>
			</div>

		</div>
	)
}

export default UsernameInput;