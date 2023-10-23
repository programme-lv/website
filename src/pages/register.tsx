import autumn from "../../public/autumn.png";
import {Container} from "@mui/system";
import Card from "@mui/joy/Card";
import LogoWithText from "@/components/LogoWithText";
import {gql, useMutation} from "@apollo/client";
import useTranslation from "next-translate/useTranslation";
import apolloClient from "@/lib/apolloClient";
import React, {useState} from "react";
import {styled} from "@mui/joy/styles";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {Button, Input} from "@mui/joy";
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import Link from "next/link";
import Alert from "@mui/joy/Alert";
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';

export default function Register() {
    return (
        <div
            style={{
                // use the src property of the image object
                backgroundImage: `url(${autumn.src})`,
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
                        <div className={"p-6"}>
                            <LogoWithText/>
                        </div>
                        <RegistrationForm/>
                    </Card>
                </Container>
            </main>
        </div>
    )
}


const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $email: String!, $firstName: String!, $lastName: String!) {
    register(username: $username, password: $password, email: $email, firstName: $firstName, lastName: $lastName) {
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

const InnerInputEmail = React.forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id}/>
            <StyledLabel htmlFor={id}>E-pasts</StyledLabel>
        </React.Fragment>
    );
});

const InnerInputFirstName = React.forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id}/>
            <StyledLabel htmlFor={id}>Vārds</StyledLabel>
        </React.Fragment>
    );
});

const InnerInputLastName = React.forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id}/>
            <StyledLabel htmlFor={id}>Uzvārds</StyledLabel>
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

const InnerInputRepeatPassword = React.forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id}/>
            <StyledLabel htmlFor={id}>Atkārtota parole</StyledLabel>
        </React.Fragment>
    );
});

function RegistrationForm() {
    const {t} = useTranslation('errors')

    const [register, {data}] = useMutation(REGISTER_MUTATION, {client: apolloClient});

    const [username, setUsername] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')

    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false);
    const [registering, setRegistering] = useState<boolean>(false);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const handlePasswordVisibilityChange = () => {
        setPasswordVisible(!passwordVisible);
    };

    async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('');
        setSuccess(false);
        setRegistering(true);

        if (password !== repeatPassword) {
            setError('Paroles nesakrīt!')
            return
        }

        try {
            await register({variables: {username, password, email, firstName, lastName}})
            setSuccess(true);
        } catch (error: any) {
            setError(error.message ?? 'Nezināma kļūda');
        }

        setRegistering(false);
    }

    return (
        <form className='flex flex-col gap-5' onSubmit={handleRegistration}>
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
                endDecorator={<EmailRoundedIcon className={"fill-blue-420"}/>}
                slots={{input: InnerInputEmail}}
                slotProps={{input: {placeholder: 'noreply@example.com', type: 'email'}}}
                sx={{
                    '--Input-minHeight': '56px',
                    '--Input-radius': '6px',
                }}
                name={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className="columns-2">
                <Input
                    slots={{input: InnerInputFirstName}}
                    slotProps={{input: {placeholder: ''}}}
                    sx={{
                        '--Input-minHeight': '56px',
                        '--Input-radius': '6px',
                    }}
                    name={"firstname"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <Input
                    slots={{input: InnerInputLastName}}
                    slotProps={{input: {placeholder: ''}}}
                    sx={{
                        '--Input-minHeight': '56px',
                        '--Input-radius': '6px',
                    }}
                    name={"lastname"}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
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
            <Input
                slots={{input: InnerInputRepeatPassword}}
                slotProps={{input: {placeholder: '', type: "password"}}}
                sx={{
                    '--Input-minHeight': '56px',
                    '--Input-radius': '6px',
                }}
                name={"repeatPassword"}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
            />
            <Button type='submit' color="primary" loadingPosition='end' endDecorator={<HowToRegRoundedIcon/>}
                    loading={registering}>Reģistrēties</Button>
            <div className="mt-4">
                Jau esi piereģistrējies? <Link href="/login"
                                               className="underline text-blue-500 hover:no-underline">Pieslēgties</Link>
            </div>
            {error &&
                <Alert variant="outlined" color="danger">
                    {t(error)}
                </Alert>
            }
            {success &&
                <Alert variant="outlined" color='success'>
                    <span>Reģistrācija veiksmīga!</span>
                </Alert>
            }

        </form>
    )
}

