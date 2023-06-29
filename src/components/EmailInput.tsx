import EmailIcon from '@mui/icons-material/Email';

interface EmailInputProps {
    email: string
    setEmail: (email: any) => void
}

function EmailInput(props: EmailInputProps) {
    return (
		<div className="flex flex-col gap-1 my-2">
            <label htmlFor="email">E-pasts</label>
			<div className="flex flex-grow items-center w-full border border-gray-400">
            <input type="email" name="email" placeholder="jūsu epasts" id="email" required className="p-2 flex-grow"
                value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				<div className="rounded-l-none py-2 px-3 bg-gray-200 border border-l-gray-400">
					<EmailIcon />
				</div>
			</div>
        </div>
    )
}

export default EmailInput;
