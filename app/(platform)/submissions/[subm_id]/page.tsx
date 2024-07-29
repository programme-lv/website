"use client";
import React from 'react';
import {
    Card,
    Divider,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    CardHeader,
    CardBody,
} from '@nextui-org/react';
import MonacoEditor from '@monaco-editor/react';
import Link from 'next/link';
import { statusTranslations } from '@/components/submissions-table';

type Evaluation = {
    uuid: string;
    status: string;
    receivedScore: number;
    possibleScore: number;
};

type Language = {
    id: string;
    fullName: string;
    monacoID: string;
    enabled: boolean;
};

type Task = {
    name: string;
    code: string;
};

type Submission = {
    uuid: string;
    submission: string;
    username: string;
    createdAt: string;
    evaluation: Evaluation;
    language: Language;
    task: Task;
    testCases: TestCaseGroup[];
};

type TestCase = {
    name: string;
    status: string;
    details: string;
};

type TestCaseGroup = {
    name: string;
    testCases: TestCase[];
};

const sampleData: Submission = {
    uuid: '314b728f-3b6b-433a-869e-b528e7cde110',
    submission: 'sample submission code',
    username: 'KrisjanisP',
    createdAt: '2021-01-25T10:32:00',
    evaluation: {
        uuid: 'ab4f8c00-96a5-44be-8385-c08059247220',
        status: 'finished',
        receivedScore: 69,
        possibleScore: 100,
    },
    language: {
        id: 'ab4f8c00-96a5-44be-8385-c08059247220',
        fullName: 'C++17 (GCC)',
        monacoID: 'cpp',
        enabled: true,
    },
    task: {
        name: 'Kvadrātveida putekļsūcējs',
        code: 'kvadrputekl',
    },
    testCases: [
        {
            name: 'Subtask 1',
            testCases: [
                { name: 'Test Case 1.1', status: 'Passed', details: 'Details of Test Case 1.1' },
                { name: 'Test Case 1.2', status: 'Failed', details: 'Details of Test Case 1.2' },
            ],
        },
        {
            name: 'Subtask 2',
            testCases: [
                { name: 'Test Case 2.1', status: 'Passed', details: 'Details of Test Case 2.1' },
            ],
        },
    ],
};

type InfoCardEntry = {
    label: string;
    value: string | number;
};

export default function SubmissionView() {
    const infoCardEntries: InfoCardEntry[] = [
        { label: 'Autors', value: sampleData.username },
        { label: 'Uzdevums', value: sampleData.task.name },
        { label: 'Valoda', value: sampleData.language.fullName },
        { label: 'Pievienots', value: new Date(sampleData.createdAt).toLocaleString('lv') },
        { label: 'Statuss', value: statusTranslations[sampleData.evaluation.status] },
        { label: 'Rezultāts', value: `${sampleData.evaluation.receivedScore} / ${sampleData.evaluation.possibleScore}` },
    ]

    function InfoEntryColumn({ entries }: { entries: InfoCardEntry[] }) {
        return (
            <div className="grid gap-x-3" style={{ gridTemplateColumns: 'auto auto' }}>
                {entries.map((entry, index) => (
                    <div key={index} className='contents'>
                        <span className="text-small text-default-700 flex items-end justify-start">{entry.label}:</span>
                        <div className="flex items-end gap-1">
                            <span className="text-default-900">
                                {['Autors', 'Valoda', 'Pievienots', 'Statuss', 'Rezultāts', 'Valoda'].includes(entry.label) && entry.value}
                                {['Uzdevums'].includes(entry.label) &&
                                    <Link href={'/tasks/' + sampleData.task.code} className='text-blue-600'>
                                        {entry.value}
                                    </Link>
                                }
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    function StackedInfoEntryColumn({ entries }: { entries: InfoCardEntry[] }) {
        return (
            <div className='flex flex-col gap-1'>
                {entries.map((entry, index) => (
                    <div key={index}>
                        <span className="text-small text-default-700">{entry.label}:</span>
                        <div className="flex items-end gap-1">
                            <span className="text-default-900">
                                {['Autors', 'Valoda', 'Pievienots', 'Statuss', 'Rezultāts', 'Valoda'].includes(entry.label) && entry.value}
                                {['Uzdevums'].includes(entry.label) &&
                                    <Link href={'/tasks/' + sampleData.task.code} className='text-blue-600'>
                                        {entry.value}
                                    </Link>
                                }
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="mt-3">
            <Card shadow="none" classNames={{ base: "radius-small border-small border-divider" }} radius='sm'>
                <CardBody>
                    <div className='max-w-[700px]'>
                    <div className="hidden md:grid gap-x-3" style={{ gridTemplateColumns: 'auto auto' }}>
                        <InfoEntryColumn entries={infoCardEntries.slice(0, 3)} />
                        <InfoEntryColumn entries={infoCardEntries.slice(3, 6)} />
                    </div>
                    <div className="hidden sm:grid md:hidden gap-x-3" style={{ gridTemplateColumns: 'auto auto' }}>
                        <InfoEntryColumn entries={infoCardEntries.slice(0, 6)} />
                    </div>
                    <div className="grid sm:hidden md:hidden gap-y-2" style={{ gridTemplateColumns: 'auto auto' }}>
                        <StackedInfoEntryColumn entries={infoCardEntries.slice(0, 6)} />
                    </div>
                    </div>
                </CardBody>
            </Card>
            <Divider className="my-4" />
            <Card shadow="none" classNames={{ base: "radius-small border-small border-divider" }} radius='sm'>
                <CardBody>
                    <MonacoEditor
                        value={sampleData.submission}
                        theme="vs-dark"
                        language={sampleData.language.monacoID}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            readOnly: true,
                        }}
                        height="400px"
                    />
                </CardBody>
            </Card>
            <Divider className="my-6" />
            <p>Test Cases</p>
            {sampleData.testCases.map((group, groupIndex) => (
                <div key={groupIndex} className="my-4">
                    <p>{group.name}</p>
                    <Table aria-label="Test Cases Table">
                        <TableHeader>
                            <TableColumn>Test Case</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Details</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {group.testCases.map((testCase, testCaseIndex) => (
                                <TableRow key={testCaseIndex}>
                                    <TableCell>{testCase.name}</TableCell>
                                    <TableCell>{testCase.status}</TableCell>
                                    <TableCell>{testCase.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    );
}
