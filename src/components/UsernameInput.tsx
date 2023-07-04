import { OutlinedInput, InputAdornment, FormControl, InputLabel } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface UsernameInputProps {
    username: string
    setUsername: (_: any) => void
}

function UsernameInput(props: UsernameInputProps) {
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="username-input">Lietotājvārds</InputLabel>
            <OutlinedInput
                id="username-input"
                type='text'
                endAdornment={
                    <InputAdornment position="end">
                        <AccountCircle />
                    </InputAdornment>
                }
                label="username"
                value={props.username}
                onChange={(e) => props.setUsername(e.target.value)}
                required
                autoFocus
                autoComplete='username'
            />
        </FormControl>
    )
}

export default UsernameInput;
