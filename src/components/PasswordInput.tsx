import { IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

interface PasswordInputProps {
    password: string
    setPassword: (_: any) => void
}

function PasswordInput(props: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl variant='outlined'>
            <InputLabel htmlFor='password-input'>Parole</InputLabel>
            <OutlinedInput
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
                value={props.password}
                onChange={(e) => props.setPassword(e.target.value)}
            />
        </FormControl>
    )
}

export default PasswordInput;
