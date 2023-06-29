import LockPersonIcon from '@mui/icons-material/LockPerson';

interface RepeatPasswordInputProps {
    password: string
    setPassword: (password: any) => void
}

function RepeatPasswordInput(props: RepeatPasswordInputProps) {
    return (
		<div className="flex flex-col gap-1 my-2 w-full">
        <label htmlFor="repeated-password">Atkārtota parole</label>
        <div className="flex flex-grow items-center w-full border border-gray-400">
            <input type="password" placeholder="atkārtojiet paroli" name="repeated-password" id="repeated-password" required className="p-2 flex-grow"
                value={props.password} onChange={(e) => props.setPassword(e.target.value)} />
            <div className="rounded-l-none py-2 px-3 bg-gray-200 border border-l-gray-400">
                <LockPersonIcon />
            </div>
        </div>
        </div>
    )
}

export default RepeatPasswordInput;