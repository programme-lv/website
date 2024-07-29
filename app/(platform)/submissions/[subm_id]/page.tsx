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
    AccordionItem,
    Accordion,
    Code,
    Spacer,
    Chip,
} from '@nextui-org/react';
import MonacoEditor from '@monaco-editor/react';
import Link from 'next/link';
import { statusTranslations } from '@/components/submissions-table';
import { Evaluation, ProgrammingLanguage, Submission } from '@/types/proglv';

type TestResultOverview = {
    id: number;
    input_preview: string;
    output_preview: string;
    answer_preview: string;
    checker_log: string;
    verdict: string;
    exec_time_ms: number;
    exec_memory_kb: number;
};

type TestCaseGroup = {
    name: string;
    testCases: TestResultOverview[];
};

const sampleData: Submission & { test_results: TestResultOverview[] } = {
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
    test_results: [
        {
            id: 1,
            input_preview: '1 2\n3 4\n',
            output_preview: '5\n7\n',
            answer_preview: '5\n7\n',
            checker_log: '',
            verdict: 'AC',
            exec_time_ms: 2,
            exec_memory_kb: 256,
        },
        {
            id: 2,
            input_preview: '4 5\n6 7\n',
            output_preview: '9\n11\n',
            answer_preview: '9\n11\n',
            checker_log: '',
            verdict: 'AC',
            exec_time_ms: 2,
            exec_memory_kb: 256,
        },
    ],
};

type InfoCardEntry = {
    label: string;
    value: string | number;
};

export default function SubmissionView() {
    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

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
            <Card shadow="none" classNames={{ base: "border-small border-divider" }} radius='sm'>
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
            <Card shadow="none" classNames={{ base: "border-small border-divider" }} radius='sm'>
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
            <Card shadow="none" classNames={{ base: "border-small border-divider" }} radius='sm'>
                <CardBody>
                    <Accordion isCompact fullWidth>
                        <AccordionItem key="1" title={`Testu grupa #1 (${['1.', '2.', '3.'].join(', ')} apakšuzdevums)`}>

                            <div className='overflow-x-scroll max-w-full w-full relative p-5  rounded-none' style={{ backgroundColor: '#f8f8f8' }}>
                                {sampleData.test_results.map((testResult, index) => (
                                    <Card shadow='none' radius='sm' className='border-small border-divider'>
                                        <CardBody>
                                            <div className='flex gap-2'>
                                            Tests #1
                                            <Chip size='sm' color='success' variant='flat'>Atbilde ir pareiza</Chip>
                                            </div>
                                            <Spacer y={4} />
                                            <div className='flex gap-4'>
                                                <div className='w-[50%]'>
                                                    <div className='flex flex-col'>
                                                        <label className='text-small text-default-700'>Testa ievaddati</label>
                                                        <Code radius='none'>{testResult.input_preview}</Code>
                                                    </div>
                                                </div>
                                                <div className='w-[50%]'>
                                                    <div className='flex flex-col'>
                                                    <label className='text-small text-default-700'>Testa atbilde</label>
                                                    <Code radius='none'>{testResult.answer_preview}</Code>
                                                    </div>
                                                </div>
                                            </div>
                                            <label>Jūsu programmas izvaddati</label>
                                            <Code radius='none'>{testResult.output_preview}</Code>
                                            <label>Pārbaudes piezīmes</label>
                                            <Code radius='none'>{testResult.checker_log}</Code>
                                        </CardBody>
                                    </Card>
                                ))}
                                <Spacer y={2} />
                                <Table aria-label="Example static collection table" shadow='none'>
                                    <TableHeader>
                                        <TableColumn>id</TableColumn>
                                        <TableColumn>verdict</TableColumn>
                                        <TableColumn>input</TableColumn>
                                        <TableColumn>output</TableColumn>
                                        <TableColumn>answer</TableColumn>
                                        <TableColumn>checker log</TableColumn>
                                        <TableColumn>time [ms]</TableColumn>
                                        <TableColumn>memory [kb]</TableColumn>
                                    </TableHeader>

                                    <TableBody>
                                        {sampleData.test_results.map((testResult, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{testResult.id}</TableCell>
                                                <TableCell>{testResult.verdict}</TableCell>
                                                <TableCell>
                                                    <Code className='h-20 w-52 overflow-hidden'>
                                                        {"fasdfasdfasdfas dfasdasdfasdfasdfasdkfljalskdfjlkasjdklfjaklsdjflkajslkdfjklasdjklflkjasfdkjaskdjf asdfkjaskldjfklasdjklfklasdjflj"}
                                                    </Code>
                                                </TableCell>
                                                <TableCell>
                                                    <Code className='h-20 w-52 overflow-hidden'>
                                                        {testResult.output_preview}
                                                    </Code>
                                                </TableCell>
                                                <TableCell>{testResult.answer_preview}</TableCell>
                                                <TableCell>{testResult.checker_log}</TableCell>
                                                <TableCell>{testResult.exec_time_ms}</TableCell>
                                                <TableCell>{testResult.exec_memory_kb}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionItem>
                        <AccordionItem key="2" title="Accordion 2">
                            {defaultContent}
                        </AccordionItem>
                        <AccordionItem key="3" title="Accordion 3">
                            {defaultContent}
                        </AccordionItem>
                    </Accordion>

                </CardBody>
            </Card>
            {/* {sampleData.testCases.map((group, groupIndex) => (
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
            ))} */}
        </div>
    );
}
