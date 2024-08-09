"use client";
import React from "react";
import {
  Card,
  CardBody,
  AccordionItem,
  Accordion,
  Spacer,
  Chip,
} from "@nextui-org/react";
import MonacoEditor from "@monaco-editor/react";
import Link from "next/link";

import { statusTranslations } from "@/components/submissions-table";
import { Submission } from "@/types/proglv";

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

const sampleData: Submission & { test_results: TestResultOverview[] } = {
  uuid: "314b728f-3b6b-433a-869e-b528e7cde110",
  submission: "sample submission code",
  username: "KrisjanisP",
  createdAt: "2021-01-25T10:32:00",
  evaluation: {
    uuid: "ab4f8c00-96a5-44be-8385-c08059247220",
    status: "finished",
    receivedScore: 69,
    possibleScore: 100,
  },
  language: {
    id: "ab4f8c00-96a5-44be-8385-c08059247220",
    fullName: "C++17 (GCC)",
    monacoId: "cpp",
  },
  task: {
    name: "Kvadrātveida putekļsūcējs",
    code: "kvadrputekl",
  },
  test_results: [
    {
      id: 1,
      input_preview: "1 2\n3 4\n",
      output_preview: "5\n7\n",
      answer_preview: "5\n",
      checker_log: "",
      verdict: "AC",
      exec_time_ms: 2,
      exec_memory_kb: 256,
    },
    {
      id: 2,
      input_preview: "4 5\n6 7\n",
      output_preview: "9\n11\n",
      answer_preview: "9\n11\n",
      checker_log: "",
      verdict: "AC",
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
    { label: "Autors", value: sampleData.username },
    { label: "Uzdevums", value: sampleData.task.name },
    { label: "Valoda", value: sampleData.language.fullName },
    {
      label: "Pievienots",
      value: new Date(sampleData.createdAt).toLocaleString("lv"),
    },
    {
      label: "Statuss",
      value: statusTranslations[sampleData.evaluation.status],
    },
    {
      label: "Rezultāts",
      value: `${sampleData.evaluation.receivedScore} / ${sampleData.evaluation.possibleScore}`,
    },
  ];

  function InfoEntryColumn({ entries }: { entries: InfoCardEntry[] }) {
    return (
      <div
        className="grid gap-x-3"
        style={{ gridTemplateColumns: "auto auto" }}
      >
        {entries.map((entry, index) => (
          <div key={index} className="contents">
            <span className="text-small text-default-700 flex items-end justify-start">
              {entry.label}:
            </span>
            <div className="flex items-end gap-1">
              <span className="text-default-900">
                {[
                  "Autors",
                  "Valoda",
                  "Pievienots",
                  "Statuss",
                  "Rezultāts",
                  "Valoda",
                ].includes(entry.label) && entry.value}
                {["Uzdevums"].includes(entry.label) && (
                  <Link
                    className="text-blue-600"
                    href={"/tasks/" + sampleData.task.code}
                  >
                    {entry.value}
                  </Link>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function StackedInfoEntryColumn({ entries }: { entries: InfoCardEntry[] }) {
    return (
      <div className="flex flex-col gap-1">
        {entries.map((entry, index) => (
          <div key={index}>
            <span className="text-small text-default-700">{entry.label}:</span>
            <div className="flex items-end gap-1">
              <span className="text-default-900">
                {[
                  "Autors",
                  "Valoda",
                  "Pievienots",
                  "Statuss",
                  "Rezultāts",
                  "Valoda",
                ].includes(entry.label) && entry.value}
                {["Uzdevums"].includes(entry.label) && (
                  <Link
                    className="text-blue-600"
                    href={"/tasks/" + sampleData.task.code}
                  >
                    {entry.value}
                  </Link>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3">
      <Card
        classNames={{ base: "border-small border-divider" }}
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <div className="max-w-[700px]">
            <div
              className="hidden md:grid gap-x-3"
              style={{ gridTemplateColumns: "auto auto" }}
            >
              <InfoEntryColumn entries={infoCardEntries.slice(0, 3)} />
              <InfoEntryColumn entries={infoCardEntries.slice(3, 6)} />
            </div>
            <div
              className="hidden sm:grid md:hidden gap-x-3"
              style={{ gridTemplateColumns: "auto auto" }}
            >
              <InfoEntryColumn entries={infoCardEntries.slice(0, 6)} />
            </div>
            <div
              className="grid sm:hidden md:hidden gap-y-2"
              style={{ gridTemplateColumns: "auto auto" }}
            >
              <StackedInfoEntryColumn entries={infoCardEntries.slice(0, 6)} />
            </div>
          </div>
        </CardBody>
      </Card>
      <Spacer y={4} />
      <Card
        classNames={{ base: "border-small border-divider" }}
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <MonacoEditor
            height="400px"
            language={sampleData.language.monacoId}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              readOnly: true,
            }}
            theme="vs-dark"
            value={sampleData.submission}
          />
        </CardBody>
      </Card>
      <Spacer y={4} />
      <Card
        classNames={{ base: "border-small border-divider" }}
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <Accordion fullWidth isCompact>
            <AccordionItem
              key="1"
              title={`Testu grupa #1 (${["1.", "2.", "3."].join(", ")} apakšuzdevums)`}
            >
              <div
                className="overflow-x-scroll flex flex-col gap-3 max-w-full w-full relative p-3  rounded-none"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                {sampleData.test_results.map((testResult) => (
                  <Card
                    key={testResult.id}
                    className="border-small border-divider"
                    radius="sm"
                    shadow="none"
                  >
                    <CardBody>
                      <div className="flex gap-2">
                        Tests #1
                        <Chip color="success" size="sm" variant="flat">
                          Atbilde ir pareiza
                        </Chip>
                      </div>
                      <Spacer y={4} />
                      <div className="flex flex-col gap-2">
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex gap-3">
                            <p className="text-small text-default-700">
                              Izpildes laiks:
                            </p>
                            <code>{testResult.exec_time_ms} ms</code>
                          </div>
                        </div>
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex gap-3">
                            <p className="text-small text-default-700">
                              Patērētā atmiņa:
                            </p>
                            <code>{testResult.exec_memory_kb} MB</code>
                          </div>
                        </div>
                      </div>
                      <Spacer y={4} />
                      <div className="flex gap-4">
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">
                              Ievaddati:
                            </p>
                            <code
                              className="text-small p-1.5"
                              style={{
                                backgroundColor: "rgba(212, 212, 216, 0.4)",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {testResult.input_preview}
                            </code>
                          </div>
                        </div>
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">
                              Atbilde:
                            </p>
                            <code
                              className="text-small p-1.5"
                              style={{
                                backgroundColor: "rgba(212, 212, 216, 0.4)",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {testResult.answer_preview}
                            </code>
                          </div>
                        </div>
                      </div>
                      <Spacer y={4} />
                      <div className="flex gap-4">
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">
                              Programmas izvaddati:
                            </p>
                            <code
                              className="text-small p-1.5"
                              style={{
                                backgroundColor: "rgba(212, 212, 216, 0.4)",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {testResult.output_preview}
                            </code>
                          </div>
                        </div>
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">
                              Pārbaudes piezīmes:
                            </p>
                            <code
                              className="text-small p-1.5"
                              style={{
                                backgroundColor: "rgba(212, 212, 216, 0.4)",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {testResult.checker_log}
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
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
