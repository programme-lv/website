import { OutlinedInput } from '@mui/material';
import { FormControl, InputLabel } from '@mui/material';

interface FirstNameInputProps {
    firstname: string
    setFirstName: (_: any) => void
}

function FirstNameInput(props: FirstNameInputProps) {
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="firstname-input">Vārds</InputLabel>
            <OutlinedInput
                id="firstname-input"
                type='text'
                label="firstname"
                value={props.firstname}
                onChange={(e) => props.setFirstName(e.target.value)}
                required
                autoComplete='firstname'
            />
        </FormControl>
    )
}

export default FirstNameInput;
