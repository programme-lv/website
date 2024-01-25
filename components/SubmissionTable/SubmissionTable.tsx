import { Table, Progress, Anchor, Text, Group, Stack } from '@mantine/core';
import classes from './SubimssionTable.module.css';
import Link from 'next/link';

const data = [
    {
        id: 69,
        datetime:{
            date: '2021-01-25',
            time: '10:32:00',
        },
        task: {
            code: 'summa',
            name: 'Saskaiti skaitļus!',
        },
        user: {
            username: 'KrisjanisP',
        },
        lang: {
            id: 'cpp',
            name: 'C++17 (GCC)'
        },
        status: {
            id: 'IQ',
            name: 'Gaida Rindā',
        },
    },
    {
        id: 68,
        datetime:{
            date: '2021-01-25',
            time: '10:32:00',
        },
        task: {
            code: 'summa',
            name: 'Saskaiti skaitļus!',
        },
        user: {
            username: 'KrisjanisP',
        },
        lang: {
            id: 'cpp',
            name: 'C++17 (GCC)'
        },
        status: {
            id: 'IQ',
            name: 'Gaida Rindā',
        },
    },
];

export default function SubmissionTable() {
    const rows = data.map((row) => {

        return (
            <Table.Tr key={row.id}>
                <Table.Td>
                    <Stack gap="xs">
                        <span>{row.datetime.date}</span>
                        <span>{row.datetime.time}</span>
                    </Stack>
                </Table.Td>
                <Table.Td>{row.user.username}</Table.Td>
                <Table.Td>
                    <Anchor component={Link} href={`/tasks/view/${row.task.code}`}>
                        {row.task.name}
                    </Anchor>
                </Table.Td>
                <Table.Td>{row.lang.name}</Table.Td>
                <Table.Td>
                    <Group justify="space-between">
                        <Text fz="xs" c="teal" fw={700}>
                            {69}%
                        </Text>
                        <Text fz="xs" c="red" fw={700}>
                            {31}%
                        </Text>
                    </Group>
                    <Progress.Root>
                        <Progress.Section
                            className={classes.progressSection}
                            value={69}
                            color="teal"
                        />

                        <Progress.Section
                            className={classes.progressSection}
                            value={31}
                            color="red"
                        />
                    </Progress.Root>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="xs">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Laiks</Table.Th>
                        <Table.Th>Lietotājs</Table.Th>
                        <Table.Th>Uzdevums</Table.Th>
                        <Table.Th>Valoda</Table.Th>
                        <Table.Th>Statuss</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}