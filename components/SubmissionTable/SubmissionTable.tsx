import { Table, Progress, Anchor, Text, Group, Stack } from '@mantine/core';
import classes from './SubimssionTable.module.css';
import Link from 'next/link';
import { ListPublicSubmissionsForSubmissionListQuery } from '@/gql/graphql';

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

type Submission = ListPublicSubmissionsForSubmissionListQuery['listPublicSubmissions'][number];

export default function SubmissionTable({submissions}: {submissions:Submission[]}) {
    // sort, show the newest first
    submissions.sort((a, b) => {
        return (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime();
    });
    const rows = submissions.map((row) => {
        let result = Math.floor(100*row.evaluation.totalScore/(row.evaluation.possibleScore??100));
        return (
            <Table.Tr key={row.id}>
                <Table.Td>
                    <Stack gap="xs">
                        <span>{(new Date(row.createdAt)).toISOString().split('T')[0]}</span>
                        <span>{(new Date(row.createdAt)).toISOString().split('T')[1].split('.')[0]}</span>
                    </Stack>
                </Table.Td>
                <Table.Td>{row.username}</Table.Td>
                <Table.Td>
                    <Anchor component={Link} href={`/tasks/view/${row.task.code}`}>
                        {row.task.name}
                    </Anchor>
                </Table.Td>
                <Table.Td>{row.language.fullName}</Table.Td>
                <Table.Td>{row.evaluation.status}</Table.Td>
                <Table.Td>
                    <Group justify="space-between">
                        <Text fz="xs" c="teal" fw={700}>
                            {result>0 ? <>{result}%</>:<></>}
                        </Text>
                        <Text fz="xs" c="red" fw={700}>
                            {100-result>0 ? <>{100-result}%</>:<></>}
                        </Text>
                    </Group>
                    <Progress.Root>
                        {result>0 &&
                        <Progress.Section
                            className={classes.progressSection}
                            value={result}
                            color="teal"
                        />}

                        {100-result>0 && <Progress.Section
                            className={classes.progressSection}
                            value={100-result}
                            color="red"
                        />}
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
                        <Table.Th>Rezultāts</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}