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
    Stack,
    SimpleGrid,
    Alert,
} from '@mantine/core';
import classes from './RegisterCard.module.css';
import Link from 'next/link';
import { IconUserPlus } from '@tabler/icons-react';
import { Form, useForm } from "@mantine/form";
import { useState } from 'react';
import register from './register';

export default function RegisterCard() {
    const form = useForm({
        initialValues: { username: "", email: "", firstName: "", lastName: "", password: "", passwordRepeat: "" },
        validate:{
            username: (value) => value.length < 3 && value.length > 20 ? "Lietotājvārdam jābūt garumā no 3 līdz 20 simboliem" : null,
            email: (value) => !value.includes("@") ? "Nederīgs e-pasta formāts" : null,
            firstName: (value) => value.length < 3 && value.length > 20 ? "Vārdam jābūt garumā no 3 līdz 20 simboliem" : null,
            lastName: (value) => value.length < 3 && value.length > 20 ? "Uzvārdam jābūt garumā no 3 līdz 20 simboliem" : null,
            password: (value) => value.length < 8 ? "Parolei jābūt vismaz 8 simbolus garai" : null,
            passwordRepeat: (value) => value !== form.values.password ? "Paroles nesakrīt" : null
        }
    });


    const [error, setError] = useState('');

    const handleSubmit = async (values:any) => {
        console.log("values: ", values);
        try {
            // Assuming the passwordRepeat field is not required by your backend and thus not included in the mutation
            const result = await register(values.username, values.password, values.email, values.firstName, values.lastName);
            console.log(result); // Handle success (e.g., redirecting the user or showing a success message)
        } catch (error) {
            setError('Registration failed. Please try again.'); // Update with more specific error handling as needed
            console.error(error);
        }
    };
    
    return (
        <Container w={600} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" className={classes.title}>
                    Laipni lūgti programme.lv!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Jau esi izveidojis savu lietotāju?{' '}
                    <Anchor size="sm" component={Link} href={"/login"}>
                        Pieslēdzies šeit
                    </Anchor>
                </Text>
                <Space h={20} />
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="sm">
                    <TextInput label="Lietotājvārds" placeholder="iecerētais lietotājvārds" required />
                    <TextInput label="E-pasts" type='email' placeholder="epasts@domens.kkas" required />
                    <SimpleGrid cols={2}>
                        <TextInput label="Vārds" placeholder='vārds' required />
                        <TextInput label="Uzvārds" placeholder='uzvārds' required />
                    </SimpleGrid>
                    <PasswordInput label="Parole" placeholder="parole (vismaz 8 simboli)" required />
                    <PasswordInput label="Atkārtota parole" placeholder="parole vēlreiz" required />
                    <Button type='submit' fullWidth mt="xl">
                        <Group gap={"md"}>
                            Reģistrēties <IconUserPlus />
                        </Group>
                    </Button>
                </Stack>
                    </form>
                    <Alert mt={20} title={error}>
                        {error}
                    </Alert>

            </Paper>
        </Container>
    );
}