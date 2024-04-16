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
} from '@mantine/core';
import classes from './Authentication.module.css';
import Link from 'next/link';
import { IconLogin2 } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { loginGQL } from '@/graphql/mutations/loginGQL';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

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

    const router = useRouter()

    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        try {
            await login({
                variables: {
                    username: values.username,
                    password: values.password
                }
            })
            notifications.show({
                title: "Pieslēgšanās veiksmīga! 🖥️",
                message: "Jūs esat veiksmīgi pieslēdzies sistēmai.",
                color: "green",
            })
            router.push("/constructor/list")
        } catch (e) {
            console.error(e)
        }
        setHandleSubmitInProgress(false);
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
					Kļūda: {loginMutation.error?.graphQLErrors.map(({ message }) => message).join("\n")}
				</Alert>}
            </Paper>
        </Container>
    );
}