import {useUser} from "@/contexts/UserContext";
import {useRouter} from "next/router";
import mountains from "../../public/mountains.png";
import React, {useState} from 'react';
import {Container} from "@mui/system";
import {Alert, Button, Card, Input} from "@mui/joy";
import LogoWithText from "@/components/LogoWithText";
import {gql, useMutation} from "@apollo/client";
import useTranslation from "next-translate/useTranslation";
import apolloClient from "@/lib/apolloClient";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Link from "next/link";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import {styled} from '@mui/joy/styles';

export default function Login() {
    const {userData, loginError} = useUser();
    const router = useRouter();
    if (!loginError && userData) {
        router.push('/tasks').then();
    }
    return (
        <div
            style={{
                // use the src property of the image object
                backgroundImage: `url(${mountains.src})`,
                // other styles
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <main className="container m-auto">
                <Container maxWidth='sm'>
                    <Card className='my-5 px-5 pb-5' variant='outlined'>
                        <div className={"py-4"}>
                            <LogoWithText/>
                        </div>
                        <LoginForm/>
                    </Card>
                </Container>
            </main>
        </div>
    )
}

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
	login(username: $username, password: $password) {
		id
		username
	}
}
`;

const StyledInput = styled('input')({
    border: 'none', // remove the native input border
    minWidth: 0, // remove the native input width
    outline: 0, // remove the native input outline
    padding: 0, // remove the native input padding
    paddingTop: '1em',
    flex: 1,
    color: 'inherit',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    textOverflow: 'ellipsis',
    '&::placeholder': {
        opacity: 0,
        transition: '0.1s ease-out',
    },
    '&:focus::placeholder': {
        opacity: 1,
    },
    '&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label': {
        top: '0.5rem',
        fontSize: '0.75rem',
    },
    '&:focus ~ label': {
        color: 'var(--Input-focusedHighlight)',
    },
    '&:-webkit-autofill': {
        alignSelf: 'stretch', // to fill the height of the root slot
    },
    '&:-webkit-autofill:not(* + &)': {
        marginInlineStart: 'calc(-1 * var(--Input-paddingInline))',
        paddingInlineStart: 'var(--Input-paddingInline)',
        borderTopLeftRadius:
            'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
        borderBottomLeftRadius:
            'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
    },
});

const StyledLabel = styled('label')(({theme}) => ({
    position: 'absolute',
    lineHeight: 1,
    top: 'calc((var(--Input-minHeight) - 1em) / 2)',
    color: theme.vars.palette.text.tertiary,
    fontWeight: theme.vars.fontWeight.md,
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InnerInputUsername = React.forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id}/>
            <StyledLabel htmlFor={id}>Lietotājvārds</StyledLabel>
        </React.Fragment>
    );
});
const InnerInputPassword = React.forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id}/>
            <StyledLabel htmlFor={id}>Parole</StyledLabel>
        </React.Fragment>
    );
});


function LoginForm() {
    const {t} = useTranslation('errors')
    const {refreshUser} = useUser();
    const [login] = useMutation(LOGIN_MUTATION, {client: apolloClient});
    const router = useRouter();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loggingIn, setLoggingIn] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handlePasswordVisibilityChange = () => {
        setPasswordVisible(!passwordVisible);
    };

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoggingIn(true);
        try {
            await login({variables: {username, password}});
            setSuccess('Pieslēgšanās veiksmīga!');
            refreshUser();
            await router.push('/tasks');
        } catch (error: any) {
            setError(error.message ?? 'Nezināma kļūda')
        }

        setLoggingIn(false);
    }

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/*<Input variant={"outlined"}  placeholder={"Lietotājvārds"} endDecorator={<PersonRoundedIcon className={"fill-blue-420"}/>} required/>*/}
            {/*<Input type="password"  variant={"outlined"} placeholder={"Parole"} endDecorator={<KeyRoundedIcon className={"fill-blue-420"}/>} required/>*/}
            <Input
                endDecorator={<PersonRoundedIcon className={"fill-blue-420"}/>}
                slots={{input: InnerInputUsername}}
                slotProps={{input: {placeholder: ''}}}
                sx={{
                    '--Input-minHeight': '56px',
                    '--Input-radius': '6px',
                }}
                name={"username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <Input
                endDecorator={
                    <div onClick={handlePasswordVisibilityChange} className={"flex"}>
                        {passwordVisible ? <VisibilityOffRoundedIcon className={"fill-blue-420"}/> :
                            <VisibilityRoundedIcon className={"fill-blue-420"}/>}
                    </div>
                }
                slots={{input: InnerInputPassword}}
                slotProps={{input: {placeholder: '', ...(!passwordVisible && {type: "password"})}}}
                sx={{
                    '--Input-minHeight': '56px',
                    '--Input-radius': '6px',
                }}
                name={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type='submit' color="primary" loadingPosition='end' endDecorator={<LoginRoundedIcon/>}
                    loading={loggingIn}>Pieslēgties</Button>
            <div className="mt-4">
                Neesi piereģistrējies? <Link href="/register"
                                             className="underline text-blue-500 hover:no-underline">Reģistrēties</Link>
            </div>

            {error &&
                <Alert variant="outlined" color="danger">
                    {t(error)}
                </Alert>
            }
            {success &&
                <Alert variant="outlined" color="success">
                    {t(success)}
                </Alert>
            }
        </form>
    )
}