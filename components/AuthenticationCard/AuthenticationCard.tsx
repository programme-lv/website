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
} from '@mantine/core';
import classes from './Authentication.module.css';

export function AuthenticationCard() {
    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Sveicināts atpakaļ!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Vēl neesi izveidojis savu lietotāju?{' '}
                <Anchor size="sm" component="button">
                    Reģistrējies šeit
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="E-pasts" placeholder="Jūsu epasts" required />
                <PasswordInput label="Parole" placeholder="Jūsu parole" required mt="md" />
                <Group justify="space-between" mt="lg">
                    <Checkbox label="Atcerēties mani" />
                    <Anchor component="button" size="sm">
                        Aizmirsi paroli?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl">
                    Pieslēgties
                </Button>
            </Paper>
        </Container>
    );
}