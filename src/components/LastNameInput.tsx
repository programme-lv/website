import PersonIcon from '@mui/icons-material/Person';

interface LastNameInputProps {
    lastname: string
    setLastName: (lastname: string) => void
}

function LastNameInput(props: LastNameInputProps) {
    return (
        <div className="flex flex-col gap-1 my-2">
            <label htmlFor="lastname">Uzvārds</label>
            <div className="flex flex-grow items-center w-full border border-gray-400">
            <input type="text" name="lastname" id="lastname" required className="p-2 flex-grow"
                value={props.lastname} onChange={(e)=>props.setLastName(e.target.value)}  placeholder="jūsu uzvārds"/>
				<div className="rounded-l-none py-2 px-3 bg-gray-200 border border-l-gray-400">
					<PersonIcon />
				</div>
            
            </div>

        </div>
    )
}

export default LastNameInput;