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

export default function SubmissionView() {
    return (
        <div className="mt-3">
            <Card shadow="none" classNames={{ base: "radius-small border-small border-divider" }} radius='sm'>
                <CardBody>
                    <div className="flex-grow flex flex-col justify-start items-start">
                        <div className="grid gap-x-3" style={{ gridTemplateColumns: 'auto auto'}}>
                            <span className="text-small text-default-700 flex items-end justify-start">Autors:</span>
                            <div className="flex items-end gap-1">
                                <span className="text-default-900">{sampleData.username}</span>
                            </div>
                            <span className="text-small text-default-700 flex items-end justify-start">Uzdevums:</span>
                            <div className="flex items-end gap-1">
                                <span className="text-default-900">
                                    <Link href={'/tasks/' + sampleData.task.code} className='text-blue-600'>
                                        {sampleData.task.name}
                                    </Link>
                                </span>
                            </div>
                            <span className="text-small text-default-700 flex items-end justify-start">Valoda:</span>
                            <div className="flex items-end gap-1">
                                <span className="text-default-900">{sampleData.language.fullName}</span>
                            </div>
                            <span className="text-small text-default-700 flex items-end justify-start">Statuss:</span>
                            <div className="flex items-end gap-1">
                                <span className="text-default-900">{statusTranslations[sampleData.evaluation.status]}</span>
                            </div>
                            <span className="text-small text-default-700 flex items-end justify-start">Rezultāts:</span>
                            <div className="flex items-end gap-1">
                                <span className="text-default-900">{sampleData.evaluation.receivedScore} / {sampleData.evaluation.possibleScore}</span>
                                <span className='text-small text-default-700'> punkti</span>
                            </div>
                            <span className="text-small text-default-700 flex items-end justify-start">Laiks:</span>
                            <div className="flex items-end gap-1">
                                <span className="text-default-900">{new Date(sampleData.createdAt).toLocaleString('lv')}</span>
                            </div>
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
