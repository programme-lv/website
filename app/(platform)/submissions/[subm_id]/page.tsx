"use client";
import React, { useState, useEffect } from "react";
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
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { getSubmission } from "@/lib/subms";

type InfoCardEntry = {
  label: string;
  value: string | number;
};

export default function SubmissionView() {
  const { subm_id } = useParams();
  let {
    data,
    error,
    isLoading,
  } = useQuery(["submission", subm_id], () => getSubmission(subm_id as string));

  const [editorHeight, setEditorHeight] = useState(400); // Initial height

  if (!data) {
    return <></>
  }

  let receivedScore = 0;
  let possibleScore = 0;

  if (data.eval_scoring_testgroups) {
    for (let testGroup of data.eval_scoring_testgroups) {
      possibleScore += testGroup.test_group_score;
      if(testGroup.wrong_tests===0&&testGroup.untested_tests===0){
        receivedScore += testGroup.test_group_score;
      }
    }
  }

  data.eval_scoring_testgroups?.sort((a, b) => a.test_group_id - b.test_group_id);

  const infoCardEntries = [
    { label: "Autors", value: data.username },
    { label: "Uzdevums", value: data.task_name },
    { label: "Valoda", value: data.p_lang_display_name },
    {
      label: "Iesūtīts",
      value: new Date(data.created_at).toLocaleString("lv"),
    },
    {
      label: "Statuss",
      value: statusTranslations[data.eval_status],
    },
    {
      label: "Rezultāts",
      value: `${receivedScore} / ${possibleScore} punkti`,
    },
  ];

  function InfoEntryColumn({ entries }: { entries: InfoCardEntry[] }) {
    return (
      <div className="grid gap-x-1 gap-y-1 mb-1 mx-1" style={{ gridTemplateColumns: "auto auto" }}>
        {entries.map((entry, index) => (
          <div key={index} className="contents">
            <span className="text-small text-default-700 flex items-end justify-start">
              {entry.label}:
            </span>
            <div className="flex items-end gap-1">
              <span className="text-default-900">
                {["Autors", "Valoda", "Iesūtīts", "Statuss", "Rezultāts", "Valoda"].includes(entry.label) && entry.value}
                {["Uzdevums"].includes(entry.label) && (
                  <Link className="text-blue-600" href={"/tasks/" + data!.task_id}>
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
      <div className="flex flex-col gap-3">
        {entries.map((entry, index) => (
          <div key={index}>
            <span className="text-small text-default-700">{entry.label}:</span>
            <div className="flex items-end gap-1">
              <span className="text-default-900">
                {["Autors", "Valoda", "Iesūtīts", "Statuss", "Rezultāts", "Valoda"].includes(entry.label) && entry.value}
                {["Uzdevums"].includes(entry.label) && (
                  <Link className="text-blue-600" href={"/tasks/" + data!.task_id}>
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

  const updateHeight = (editor:any) => {
    const contentHeight =Math.max(100, editor.getContentHeight());
    setEditorHeight(contentHeight);
    editor.layout({ height: contentHeight });
  };

  return (
    <div className="mt-3">
      <Card classNames={{ base: "border-small border-divider" }} radius="sm" shadow="none">
        <CardBody>
          <div className="max-w-[700px]">
            <div className="hidden md:grid gap-x-3" style={{ gridTemplateColumns: "auto auto" }}>
              <InfoEntryColumn entries={infoCardEntries.slice(0, 3)} />
              <InfoEntryColumn entries={infoCardEntries.slice(3, 6)} />
            </div>
            <div className="hidden sm:grid md:hidden gap-x-3" style={{ gridTemplateColumns: "auto auto" }}>
              <InfoEntryColumn entries={infoCardEntries.slice(0, 6)} />
            </div>
            <div className="grid sm:hidden md:hidden gap-y-2" style={{ gridTemplateColumns: "auto auto" }}>
              <StackedInfoEntryColumn entries={infoCardEntries.slice(0, 6)} />
            </div>
          </div>
        </CardBody>
      </Card>
      <Spacer y={4} />
      <Card classNames={{ base: "border-small border-divider" }} radius="sm" shadow="none">
        <CardBody>
          <MonacoEditor
            height={editorHeight + "px"}
            language={data.p_lang_monaco_id}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              readOnly: true,
              scrollbar: {
                vertical: 'hidden',         // Hides vertical scrollbar
                horizontal: 'hidden',       // Hides horizontal scrollbar
                alwaysConsumeMouseWheel: false, // Prevents editor from consuming mouse wheel events
              },
              overviewRulerLanes: 0, 
              scrollBeyondLastLine: false,
            }}
            theme="vs-dark"
            value={data.subm_content}
            onMount={(editor) => {
              updateHeight(editor)
            }
            }
          />
        </CardBody>
      </Card>
      <Spacer y={4} />
      <Card classNames={{ base: "border-small border-divider" }} radius="sm" shadow="none">
        <CardBody className="px-0 lg:px-2">
          <Accordion fullWidth isCompact variant="light" defaultExpandedKeys={['1']}>
      {data.eval_scoring_testgroups?.map((testGroup) => (
            <AccordionItem
              key={testGroup.test_group_id}
              startContent={<><span className="text-small">Testu grupa </span><span>#{String(testGroup.test_group_id).padStart(2, '0')}</span><span> ({testGroup.statement_subtask}. <span className="text-small">apakšuzdevums</span>)</span></>}
            >
              <div className="overflow-x-scroll flex flex-col gap-2 max-w-full w-full relative p-2  rounded-none" style={{ backgroundColor: "#f8f8f8" }}>
                {data!.eval_test_results.map((testResult) => {
                  if(testResult.test_group !== testGroup.test_group_id) return null;
                  let verdict = "AC";
                  if (testResult.memory_limit_exceeded) verdict = "MLE";
                  if (testResult.time_limit_exceeded) verdict = "TLE";
                  if (testResult.checker_exit_code !== 0) verdict = "WA";
                  return (
                  <Card key={testResult.test_id} className="border-small border-divider" radius="none" shadow="none">
                    <CardBody>
                      <div className="flex gap-4 flex-wrap">
                      <div className="flex gap-2 items-center">

                        <span className="text-sm">Tests</span> #{testResult.test_id}
                        <Chip color={(verdict === "AC" ? "success" : "danger")??false} size="sm" variant="flat">
                          {verdict === "AC" && "Atbilde ir pareiza"}
                          {verdict === "MLE" && "Pārsniegts atmiņas limits"}
                          {verdict === "TLE" && "Pārsniegts laika limits"}
                          {verdict === "WA" && "Atbilde ir nepareiza"}
                        </Chip>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <div className="flex gap-1 items-center">
                            <p className="text-small text-default-700 whitespace-nowrap">Izpildes laiks:</p>
                            <code className="whitespace-nowrap">{testResult.subm_cpu_time_millis} ms</code>
                          </div>
                          <div className="flex gap-1 items-center">
                            <p className="text-small text-default-700 whitespace-nowrap">Patērētā atmiņa:</p>
                            <code className="whitespace-nowrap">{Math.ceil(testResult.subm_mem_kibi_bytes *0.001024*100)/100} MB</code>
                          </div>
                          </div>
                      </div>
                      <Spacer y={1.5} />
                      <div className="flex flex-col gap-4">
                        <div className="w-full overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-tiny text-default-700 select-none">Ievaddati:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.input_trimmed}
                            </code>
                          </div>
                        </div>
                      </div>
                      <Spacer y={2} />
                      <div className="flex gap-x-3 flex-wrap">
                        <div className="md:flex-grow md:w-auto w-full overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-tiny text-default-700 select-none">Programmas izvaddati:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.subm_stdout_trimmed}
                            </code>
                          </div>
                        </div>
                        <div className="md:flex-grow md:w-auto w-full overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-tiny text-default-700 select-none">Atbilde:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.answer_trimmed}
                            </code>
                          </div>
                        </div>
                      </div>
                      <Spacer y={2} />
                      <div className="flex gap-4">
                        <div className="w-full overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-tiny text-default-700 select-none">Pārbaudes piezīmes:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.checker_stderr_trimmed}
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )
                })}
              </div>
            </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card> 
      <Spacer y={2} />
    </div>
  );
}


      /* <Card classNames={{ base: "border-small border-divider" }} radius="sm" shadow="none">
        <CardBody>
          <Accordion fullWidth isCompact>
            <AccordionItem
              key="1"
              title={`Testu grupa #1 (${sampleData.test_results.map((_, i) => `${i + 1}.`).join(" ")} apakšuzdevums)`}
            >
              <div className="overflow-x-scroll flex flex-col gap-3 max-w-full w-full relative p-3  rounded-none" style={{ backgroundColor: "#f8f8f8" }}>
                {sampleData.test_results.map((testResult) => (
                  <Card key={testResult.id} className="border-small border-divider" radius="sm" shadow="none">
                    <CardBody>
                      <div className="flex gap-2">
                        Tests #{testResult.id}
                        <Chip color={testResult.verdict === "AC" ? "success" : "error"} size="sm" variant="flat">
                          {testResult.verdict === "AC" ? "Atbilde ir pareiza" : "Atbilde ir nepareiza"}
                        </Chip>
                      </div>
                      <Spacer y={4} />
                      <div className="flex flex-col gap-2">
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex gap-3">
                            <p className="text-small text-default-700">Izpildes laiks:</p>
                            <code>{testResult.exec_time_ms} ms</code>
                          </div>
                        </div>
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex gap-3">
                            <p className="text-small text-default-700">Patērētā atmiņa:</p>
                            <code>{testResult.exec_memory_kb} KB</code>
                          </div>
                        </div>
                      </div>
                      <Spacer y={4} />
                      <div className="flex gap-4">
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">Ievaddati:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.input_preview}
                            </code>
                          </div>
                        </div>
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">Atbilde:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.answer_preview}
                            </code>
                          </div>
                        </div>
                      </div>
                      <Spacer y={4} />
                      <div className="flex gap-4">
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">Programmas izvaddati:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
                              {testResult.output_preview}
                            </code>
                          </div>
                        </div>
                        <div className="w-[50%] overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-small text-default-700">Pārbaudes piezīmes:</p>
                            <code className="text-small p-1.5" style={{ backgroundColor: "rgba(212, 212, 216, 0.4)", whiteSpace: "pre-wrap" }}>
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
              Default content here.
            </AccordionItem>
            <AccordionItem key="3" title="Accordion 3">
              Default content here.
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card> */