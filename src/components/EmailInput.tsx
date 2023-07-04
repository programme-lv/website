import EmailIcon from '@mui/icons-material/Email';
import { InputLabel, InputAdornment, OutlinedInput, FormControl } from '@mui/material';

interface EmailInputProps {
    email: string
    setEmail: (_: any) => void
}

function EmailInput(props: EmailInputProps) {
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="email-input">E-pasts</InputLabel>
            <OutlinedInput
                id="email-input"
                type='email'
                endAdornment={
                    <InputAdornment position="end">
                        <EmailIcon />
                    </InputAdornment>
                }
                label="email"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
                required
                autoComplete='email'
            />
        </FormControl>
    )
}

export default EmailInput;
