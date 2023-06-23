interface FirstNameInputProps {
    firstname: string
    setFirstName: (firstname: any) => void
}

function FirstNameInput(props: FirstNameInputProps) {
    return (
        <>
            <label htmlFor="firstname">Jūsu vārds</label>
            <input type="text" name="firstname" id="firstname" required
                value={props.firstname} onChange={(e)=>props.setFirstName(e.target.value)} />
        </>
    )
}

export default FirstNameInput;