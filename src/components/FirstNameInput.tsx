import PersonIcon from '@mui/icons-material/Person';

interface FirstNameInputProps {
    firstname: string
    setFirstName: (_: any) => void
}

function FirstNameInput(props: FirstNameInputProps) {
    return (
        <div className="flex flex-col gap-1 my-2">
            <label htmlFor="firstname">Jūsu vārds</label>
            <div className="flex flex-grow items-center w-full border border-gray-400">
                <input type="text" name="firstname" placeholder="jūsu vārds" id="firstname" required className="p-2 flex-grow"
                    value={props.firstname} onChange={(e) => props.setFirstName(e.target.value)} />
                    <div className="rounded-l-none py-2 px-3 bg-gray-200 border border-l-gray-400">
                        <PersonIcon />
                    </div>
            </div>
        </div>
    )
}

export default FirstNameInput;