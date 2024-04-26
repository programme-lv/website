"use client";
import {
	TextInput,
	PasswordInput,
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
	LoadingOverlay,
} from '@mantine/core';
import classes from './RegisterCard.module.css';
import Link from 'next/link';
import { IconUserPlus } from '@tabler/icons-react';
import { useForm } from "@mantine/form";
import { registerGQL } from '@/graphql/mutations/registerGQL';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { loginGQL } from '@/graphql/mutations/loginGQL';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegisterCard() {
	let form = useForm({
		initialValues: { username: "", email: "", firstName: "", lastName: "", password: "", passwordRepeat: "" },
		validate: {
			username: (value) => (value.length < 3 && value.length > 20) ? "Lietotājvārdam jābūt garumā no 3 līdz 20 simboliem" : null,
			email: (value) => !value.includes("@") ? "Nederīgs e-pasta formāts" : null,
			firstName: (value) => (value.length < 3 && value.length > 20) ? "Vārdam jābūt garumā no 3 līdz 20 simboliem" : null,
			lastName: (value) => (value.length < 3 && value.length > 20) ? "Uzvārdam jābūt garumā no 3 līdz 20 simboliem" : null,
			password: (value) => value.length < 8 ? "Parolei jābūt vismaz 8 simbolus garai" : null,
			passwordRepeat: (value, values) => value !== values.password ? "Paroles nesakrīt" : null
		}
	});

	const [register, registerMutation] = useMutation(registerGQL)
	const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false)
	const [success, setSuccess] = useState(false)
	const router = useRouter()

	useEffect(()=>{
		setHandleSubmitInProgress(registerMutation.loading)
	},[registerMutation.loading])

	useEffect(()=>{
		if(registerMutation.error){
			notifications.show({
				title: "Kļūda! 🚨",
				message: "Reģistrācija neveiksmīga. Lūdzu, pārbaudiet ievadītos datus.",
				color: "red",
			})
		}
	},[registerMutation.error])

	useEffect(()=>{
		if(registerMutation.data?.register){
			setSuccess(true)
			notifications.show({
				title: "Reģistrācija veiksmīga! 🎉",
				message: "Lūdzu, pieslēdzies, izmantojot savu lietotājvārdu un paroli.",
				color: "teal",
			})
			router.push("/login")
		}
	},[registerMutation.data])

	const handleSubmit = async (values: any) => {
		if(handleSubmitInProgress) return;
		register({
			variables: {
				username: values.username,
				password: values.password,
				email: values.email,
				firstName: values.firstName,
				lastName: values.lastName
			}
		}).catch(e => console.error(e))
	};

	return (
		<Container w={{md:600}} my={40}>
			<Paper withBorder shadow="md" p={30} mt={30} radius="md" pos={'relative'}>
				<LoadingOverlay	visible={handleSubmitInProgress||success} />
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
						<TextInput {...form.getInputProps('username')} label="Lietotājvārds" placeholder="iecerētais lietotājvārds" required />
						<TextInput {...form.getInputProps('email')} label="E-pasts" type='email' placeholder="epasts@domens.kkas" required />
						<SimpleGrid cols={2}>
							<TextInput {...form.getInputProps('firstName')} label="Vārds" placeholder='vārds' required />
							<TextInput {...form.getInputProps('lastName')} label="Uzvārds" placeholder='uzvārds' required />
						</SimpleGrid>
						<PasswordInput {...form.getInputProps('password')} label="Parole" placeholder="parole (vismaz 8 simboli)" required />
						<PasswordInput {...form.getInputProps('passwordRepeat')} label="Atkārtota parole" placeholder="parole vēlreiz" required />
						<Button type='submit' fullWidth mt="xl">
							<Group gap={"md"}>
								Reģistrēties <IconUserPlus />
							</Group>
						</Button>
					</Stack>
				</form>
				{registerMutation.error && <Alert variant='outline' color='red' mt={20}>
					Kļūda: {registerMutation.error?.graphQLErrors.map(({ message }) => message).join("\n")}
				</Alert>}
			</Paper>
		</Container>
	);
}