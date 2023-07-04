import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

interface LastNameInputProps {
    lastname: string
    setLastName: (_: string) => void
}

function LastNameInput(props: LastNameInputProps) {
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="lastname-input">Uzvārds</InputLabel>
            <OutlinedInput
                id="lastname-input"
                type='text'
                label="lastname"
                value={props.lastname}
                onChange={(e) => props.setLastName(e.target.value)}
                required
                autoComplete='lastname'
            />
        </FormControl>
    )
}

export default LastNameInput;
