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
} from '@mantine/core';
import classes from './Authentication.module.css';
import Link from 'next/link';
import { IconLogin2 } from '@tabler/icons-react';

export default function LoginCard() {
    return (
        <Container w={600} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
                <TextInput label="Lietotājvārds" placeholder="Jūsu lietotājvārds" required />
                <Space h={10} />
                <PasswordInput label="Parole" placeholder="Jūsu parole" required mt="md" />
                <Space h={10} />
                <Group justify="space-between" mt="lg">
                    <Checkbox label="Atcerēties mani" />
                    <Anchor component="button" size="sm">
                        Aizmirsi paroli?
                    </Anchor>
                </Group>
                <Space h={10} />
                <Button fullWidth mt="xl">
                    <Group gap={"md"}>
                    Pieslēgties <IconLogin2/>
                    </Group>
                </Button>
            </Paper>
        </Container>
    );
}