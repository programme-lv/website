"use client";
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Space,
    LoadingOverlay,
    Stack,
    Alert,
    Flex,
} from '@mantine/core';
import classes from './Authentication.module.css';
import Link from 'next/link';
import { IconLogin2 } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { loginGQL } from '@/graphql/mutations/loginGQL';
import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '@/lib/AuthContext';

export default function LoginCard() {
    let form = useForm({
        initialValues: { username: "", password: "" },
        validate: {
            username: (value) => (value.length < 3 && value.length > 20) ? "Lietotājvārdam jābūt garumā no 3 līdz 20 simboliem" : null,
            password: (value) => value.length < 8 ? "Parolei jābūt vismaz 8 simbolus garai" : null
        }
    });

    const [login, loginMutation] = useMutation(loginGQL)
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false)
    const authContext = useContext(AuthContext);

    const router = useRouter()

    useEffect(()=>{
        setHandleSubmitInProgress(loginMutation.loading)
    },[loginMutation.loading])

    useEffect(()=>{
        if(loginMutation.error){
            notifications.show({
                title: "Kļūda! 🚨",
                message: "Pieslēgšanās neveiksmīga. Lūdzu, pārbaudiet ievadītos datus.",
                color: "red",
            })
        }
    },[loginMutation.error])

    useEffect(()=>{
        if(loginMutation.data?.login){
            notifications.show({
                title: "Pieslēgšanās veiksmīga! 🖥️",
                message: "Jūs esat veiksmīgi pieslēdzies sistēmai.",
                color: "green",
            })
            authContext?.login(loginMutation.data.login!);
            router.push("/tasks/list")
            router.refresh()
            sessionStorage.clear();
        }
    },[loginMutation.data])



    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        login({
            variables: {
                username: values.username,
                password: values.password
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <Container w={600} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos={"relative"}>
                <LoadingOverlay visible={handleSubmitInProgress} />
                <Title ta="center" className={classes.title}>
                    Sveicināti atpakaļ! :)
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Vēl neesi izveidojis savu lietotāju?{' '}
                    <Anchor size="sm" component={Link} href={"/register"}>
                        Reģistrējies šeit
                    </Anchor>
                </Text>
                <Space h={20} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="sm">
                        <TextInput {...form.getInputProps('username')} label="Lietotājvārds" placeholder="Jūsu lietotājvārds" required />
                        <PasswordInput {...form.getInputProps('password')} label="Parole" placeholder="Jūsu parole" required mt="md" />
                        {/* <Group justify="space-between" mt="lg">
                            <Checkbox label="Atcerēties mani" />
                            <Anchor component="button" size="sm">
                                Aizmirsi paroli?
                            </Anchor>
                        </Group> */}
                        <Button type='submit' fullWidth mt="xl">
                            <Group gap={"md"}>
                                Pieslēgties <IconLogin2 />
                            </Group>
                        </Button>
                    </Stack>
                </form>
				{loginMutation.error && <Alert variant='outline' color='red' mt={20}>
                    <Flex justify="space-between">
					<Text>🚨</Text>
                    <Text ta={'center'}>
                    {loginMutation.error?.graphQLErrors.map(({ message }) => message).join("\n")}
                    </Text>
					<Text>🚨</Text>
                    </Flex>
                
				</Alert>}
            </Paper>
        </Container>
    );
}