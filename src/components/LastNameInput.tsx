interface LastNameInputProps {
    lastname: string
    setLastName: (lastname: string) => void
}

function LastNameInput(props: LastNameInputProps) {
    return (
        <>
            <label htmlFor="lastname">Uzvārds</label>
            <input type="text" name="lastname" id="lastname" required
                value={props.lastname} onChange={(e)=>props.setLastName(e.target.value)} />
        </>
    )
}

export default LastNameInput;