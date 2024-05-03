import { Table, Progress, Anchor, Text, Group, Stack, Modal } from '@mantine/core';
import classes from './SubimssionTable.module.css';
import Link from 'next/link';
import { ListPublicSubmissionsForSubmissionListQuery } from '@/gql/graphql';
import { useEffect, useRef, useState } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { graphql } from '@/gql';
import { useSubscription } from '@apollo/client';
import { useDisclosure } from '@mantine/hooks';

const data = [
    {
        id: 69,
        datetime: {
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
        datetime: {
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

const onSubmissionUpdateGQL = graphql(`
subscription OnSubmissionUpdate($submissionId: ID!) {
    onSubmissionUpdate(submissionId: $submissionId) {
        id
        submission
        username
        createdAt
        evaluation {
            id
            status
            totalScore
            possibleScore
        }
    }
}
`);


export default function SubmissionTable({ submissions }: { submissions: Submission[] }) {
    // sort, show the newest first
    submissions.sort((a, b) => {
        return (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime();
    });

    const [submissionsState, setSubmissionsState] = useState(submissions);

    const [opened, { open, close }] = useDisclosure(false);
    const [openedCode, setOpenedCode] = useState<{ code: string, langMID: string } | null>(null);

    const { data, loading } = useSubscription(onSubmissionUpdateGQL, {
        variables: {
            submissionId: submissions[0].id
        },
        onData: (data) => {
            if (!data.data.data) return;
            console.log(data.data.data.onSubmissionUpdate)
            const update = data.data.data.onSubmissionUpdate;
            let idx = submissionsState.findIndex((submission) => submission.id === update.id);
            submissionsState[idx] = {
                ...submissionsState[idx],
                evaluation: {
                    id: update.evaluation.id,
                    status: update.evaluation.status,
                    totalScore: update.evaluation.totalScore,
                    possibleScore: update.evaluation.possibleScore,
                },
            }
            setSubmissionsState([...submissionsState]);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    function handleOpenCodeModalForSubmId(submissionID: string) {
        let idx = submissionsState.findIndex((submission) => submission.id === submissionID);
        let submission = submissionsState[idx];

        setOpenedCode({
            code: submission.submission,
            langMID: submission.language.monacoID ?? ""
        });
        open();

    }

    const rows = submissionsState.map((row) => {
        let result = Math.floor(100 * row.evaluation.totalScore / (row.evaluation.possibleScore ?? 100));
        return (
            <Table.Tr key={row.id}>
                <Table.Td>
                    <Anchor onClick={() => handleOpenCodeModalForSubmId(row.id)}>
                        {row.id}
                    </Anchor>
                </Table.Td>
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
                            {result > 0 ? <>{result}%</> : <></>}
                        </Text>
                        <Text fz="xs" c={row.evaluation.status === "F" ? "red" : "gray"} fw={700}>
                            {100 - result > 0 ? <>{100 - result}%</> : <></>}
                        </Text>
                    </Group>
                    <Progress.Root>
                        {result > 0 &&
                            <Progress.Section
                                className={classes.progressSection}
                                value={result}
                                color="teal"
                            />}

                        {100 - result > 0 && <Progress.Section
                            className={classes.progressSection}
                            value={100 - result}
                            color={row.evaluation.status === "F" ? "red" : "gray"}
                        />}
                    </Progress.Root>
                </Table.Td>
                <Table.Td>{statusTranslations[row.evaluation.status as keyof typeof statusTranslations]}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <>
            <Modal opened={opened} onClose={close} size={"55rem"}>
                <MonacoEditor
                    value={openedCode?.code}
                    theme="vs-dark"
                    language={openedCode?.langMID}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        readOnly: true
                    }}
                    height={'55rem'}
                />
            </Modal>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="xs" striped withColumnBorders horizontalSpacing={'md'}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={"4em"}>
                                #
                            </Table.Th>
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
        </>
    );
}