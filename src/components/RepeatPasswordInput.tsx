import { FormControl, InputLabel, OutlinedInput } from '@mui/material';

interface RepeatPasswordInputProps {
    password: string
    setPassword: (_: any) => void
}

function RepeatPasswordInput(props: RepeatPasswordInputProps) {
    return (
        <FormControl variant='outlined'>
            <InputLabel htmlFor='password-input'>Atkārtota Parole</InputLabel>
            <OutlinedInput
                id="password-input"
                type={'password'}
                label="Password"
                value={props.password}
                onChange={(e) => props.setPassword(e.target.value)}
            />
        </FormControl>
    )
}

export default RepeatPasswordInput;
