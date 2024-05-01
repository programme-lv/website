import { Table, Progress, Anchor, Text, Group, Stack } from '@mantine/core';
import classes from './SubimssionTable.module.css';
import Link from 'next/link';
import { ListPublicSubmissionsForSubmissionListQuery } from '@/gql/graphql';
import { useEffect, useRef } from 'react';

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

const statusTranslations = {
    "IQ": "Gaida rindā",
    "F": "Izvērtēts",
    "T": "Tiek testēts",
    "C": "Tiek kompilēts",
    "CE": "Kompilācijas kļūda",
    "ISE": "Servera kļūda",
}

type Submission = ListPublicSubmissionsForSubmissionListQuery['listPublicSubmissions'][number];

export default function SubmissionTable({submissions}: {submissions:Submission[]}) {
    const tableRef = useRef(null)

    // TODO: build a responsive table
    
    // useEffect(() => {
    //     let resizeObserverEntries:ResizeObserverEntry[] = []
    
    //     const observer = new ResizeObserver((entries)=>{
    //         resizeObserverEntries = entries
    //         console.log(entries[0].target.clientWidth)
    //     })

    //     if(tableRef.current) observer.observe(tableRef.current)

    //     return () => {
    //         // resizeObserverEntries.forEach((entry)=>entry.target.remove())
    //         observer.disconnect()
    //     }
    // },[])

    // sort, show the newest first
    submissions.sort((a, b) => {
        return (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime();
    });
    const rows = submissions.map((row) => {
        let result = Math.floor(100*row.evaluation.totalScore/(row.evaluation.possibleScore??100));
        return (
            <Table.Tr key={row.id}>
                <Table.Td>{row.id}</Table.Td>
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
                <Table.Td>{statusTranslations[row.evaluation.status as keyof typeof statusTranslations]}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Table.ScrollContainer minWidth={800} ref={tableRef}>
            <Table verticalSpacing="xs" striped withColumnBorders horizontalSpacing={'md'}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={"4em"}>#</Table.Th>
                        <Table.Th w={"8em"}>Laiks</Table.Th>
                        <Table.Th w={"16em"}>Lietotājs</Table.Th>
                        <Table.Th w={"24em"}>Uzdevums</Table.Th>
                        <Table.Th w={"16em"}>Valoda</Table.Th>
                        <Table.Th w={"24em"}>Rezultāts</Table.Th>
                        <Table.Th w={"16em"}>Statuss</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}