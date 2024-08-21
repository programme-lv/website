"use client";
import React, { useState } from "react";
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
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { statusTranslations } from "@/components/submissions-table";
import { getSubmission } from "@/lib/subms";
import { cn } from "@/components/cn";
import { TestResult } from "@/types/proglv";

type InfoCardEntry = {
  label: string;
  value: string | number;
};

export default function SubmissionView() {
  const { subm_id } = useParams();
  let { data, error, isLoading } = useQuery(["submission", subm_id], () =>
    getSubmission(subm_id as string),
  );

  const [editorHeight, setEditorHeight] = useState(400); // Initial height

  if (!data) {
    return <></>;
  }

  let receivedScore = 0;
  let possibleScore = 0;

  if (data.eval_scoring_testgroups) {
    for (let testGroup of data.eval_scoring_testgroups) {
      possibleScore += testGroup.test_group_score;
      if (testGroup.wrong_tests === 0 && testGroup.untested_tests === 0) {
        receivedScore += testGroup.test_group_score;
      }
    }
  } else if (data.eval_scoring_tests) {
    let wrong = data.eval_scoring_tests.wrong;
    let accepted = data.eval_scoring_tests.accepted;
    let untested = data.eval_scoring_tests.untested;

    possibleScore = wrong + accepted + untested;
    receivedScore = accepted;
  }

  data.eval_scoring_testgroups?.sort(
    (a, b) => a.test_group_id - b.test_group_id,
  );

  const infoCardEntries = [
    { label: "Autors", value: data.username },
    {
      label: "Uzdevums",
      value: (
        <Link
          className="text-blue-600 hover:underline"
          href={`/tasks/${data.task_id}`}
        >
          {data.task_name}
        </Link>
      ),
    },
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
      value: (
        <div>
          <span
            className={cn(
              "",
              { "text-success-600": receivedScore === possibleScore },
              { "text-danger-600": receivedScore === 0 && possibleScore > 0 },
              {
                "text-warning-500":
                  receivedScore > 0 && receivedScore < possibleScore,
              },
            )}
          >
            {receivedScore} / {possibleScore}
          </span>{" "}
          punkti
        </div>
      ),
    },
  ];

  const updateHeight = (editor: any) => {
    const contentHeight = Math.max(100, editor.getContentHeight());

    setEditorHeight(contentHeight + 10);
    editor.layout({ height: contentHeight });
  };

  return (
    <div className="mt-3 flex flex-col flex-grow relative">
      <Card
        classNames={{ base: "border-small border-divider" }}
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <div className="flex flex-wrap gap-x-6 gap-y-3 lg:gap-8 xl:gap-10 px-1">
            {infoCardEntries.map((entry) => {
              return (
                <div key={entry.label} className="flex flex-col">
                  <span className="text-tiny text-default-600">
                    {entry.label}
                  </span>
                  <span>{entry.value}</span>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
      <Spacer y={3} />
      <Card
        classNames={{ base: "border-small border-divider" }}
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <MonacoEditor
            height={editorHeight + "px"}
            language={data.p_lang_monaco_id}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              readOnly: true,
              scrollbar: {
                vertical: "hidden", // Hides vertical scrollbar
                horizontal: "hidden", // Hides horizontal scrollbar
                alwaysConsumeMouseWheel: false, // Prevents editor from consuming mouse wheel events
              },
              overviewRulerLanes: 0,
              scrollBeyondLastLine: false,
            }}
            theme="vs-dark"
            value={data.subm_content}
            onMount={(editor) => {
              updateHeight(editor);
            }}
          />
        </CardBody>
      </Card>
      <Spacer y={3} />
      {data.eval_details.programming_lang.compileCmd && (
        <>
          <Card
            classNames={{ base: "border-small border-divider" }}
            radius="sm"
            shadow="none"
          >
            <CardBody>
              <div className="flex flex-col gap-1">
                <p className="text-small text-default-900 select-none">
                  Kompilācijas izvaddati:
                </p>
                <code
                  className="text-small p-1.5 min-h-[32px]"
                  style={{
                    backgroundColor: "rgba(212, 212, 216, 0.3)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {data.eval_details.compile_stdout_trimmed}
                  {data.eval_details.compile_stderr_trimmed}
                </code>
              </div>
            </CardBody>
          </Card>
          <Spacer y={3} />
        </>
      )}
      {data.eval_scoring_testgroups &&
        data.eval_scoring_testgroups.length > 0 && (
          <Card
            classNames={{ base: "border-small border-divider" }}
            radius="sm"
            shadow="none"
          >
            <CardBody className="px-0 lg:px-1 p-0">
              <Accordion
                fullWidth
                isCompact
                defaultExpandedKeys={["1"]}
                variant="light"
              >
                {data.eval_scoring_testgroups?.map((testGroup) => (
                  <AccordionItem
                    key={testGroup.test_group_id}
                    classNames={{ startContent: "w-[80%]" }}
                    startContent={
                      <div className="flex flex-grow justify-start gap-x-3 items-center flex-wrap">
                        <div className="ms-1 flex gap-x-2">
                          <div className="whitespace-nowrap">
                            <span className="text-small text-default-600">
                              Testu grupa{" "}
                            </span>
                            <span className="font-mono">
                              #
                              {String(testGroup.test_group_id).padStart(2, "0")}
                            </span>
                          </div>
                          <div>
                            <span className="whitespace-nowrap">
                              {" "}
                              ({" "}
                              <span className="font-mono">
                                {testGroup.statement_subtask}
                              </span>
                              .{" "}
                              <span className="text-small text-default-600">
                                apakšuzdevums
                              </span>{" "}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="ms-1">
                          <span
                            className={`whitespace-nowrap ${
                              testGroup.wrong_tests === 0 &&
                              testGroup.untested_tests === 0 &&
                              "text-success-600"
                            } ${testGroup.wrong_tests > 0 && "text-danger-600"}`}
                          >
                            <span className={`font-mono`}>
                              {testGroup.wrong_tests === 0 &&
                              testGroup.untested_tests === 0
                                ? testGroup.test_group_score
                                : 0}
                            </span>{" "}
                            /{" "}
                            <span className="font-mono">
                              {testGroup.test_group_score}
                            </span>
                          </span>
                          <span className="text-small text-default-600">
                            {" "}
                            punkti
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <div
                      className="overflow-x-scroll flex flex-col lg:gap-2 max-w-full w-full relative lg:p-2  rounded-none"
                      style={{ backgroundColor: "#f8f8f8" }}
                    >
                      {data!.eval_test_results.map((testResult) => {
                        if (testResult.test_group !== testGroup.test_group_id)
                          return null;

                        return (
                          <SingleTestResultCard
                            key={testResult.test_id}
                            testResult={testResult}
                          />
                        );
                      })}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
          </Card>
        )}
      {data.eval_scoring_tests &&
        data.eval_test_results &&
        data.eval_test_results.map((testResult) => {
          return (
            <div key={testResult.test_id}>
              <SingleTestResultCard testResult={testResult} />
              <Spacer y={2} />
            </div>
          );
        })}
      <Spacer y={2} />
    </div>
  );
}

function SingleTestResultCard({ testResult }: { testResult: TestResult }) {
  let verdict = "AC";

  if (testResult.memory_limit_exceeded) verdict = "MLE";
  else if (testResult.time_limit_exceeded) verdict = "TLE";
  else if (testResult.subm_exit_code !== 0) verdict = "RE";
  else if (testResult.checker_exit_code !== 0) verdict = "WA";

  return (
    <Card
      key={testResult.test_id}
      className="border-small border-divider"
      radius="sm"
      shadow="none"
    >
      <CardBody>
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2 items-center">
            <span className="text-sm">Tests</span> #{testResult.test_id}
            {testResult.reached && (
              <Chip
                color={
                  (verdict === "AC"
                    ? "success"
                    : verdict === "RE"
                      ? "secondary"
                      : "danger") ?? false
                }
                size="sm"
                variant="flat"
              >
                {verdict === "AC" && "Atbilde ir pareiza"}
                {verdict === "MLE" && "Pārsniegts atmiņas limits"}
                {verdict === "TLE" && "Pārsniegts izpildes laiks"}
                {verdict === "WA" && "Atbilde ir nepareiza"}
                {verdict === "RE" && "Izpildes kļūda"}
              </Chip>
            )}
            {!testResult.reached && (
              <Chip color={"default"} size="sm" variant="flat">
                Nav sasniegts
              </Chip>
            )}
          </div>
          <div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
            <div className="flex gap-1 items-center">
              <p className="text-small text-default-700 whitespace-nowrap">
                Izpildes laiks:
              </p>
              <code className="whitespace-nowrap h-[20px]">
                {testResult.subm_cpu_time_millis}ms
              </code>
            </div>
            <div className="flex gap-1 items-center">
              <p className="text-small text-default-700 whitespace-nowrap">
                Patērētā atmiņa:
              </p>
              <code className="whitespace-nowrap h-[20px]">
                {Math.ceil(testResult.subm_mem_kibi_bytes * 0.001024 * 100) /
                  100}
                MB
              </code>
            </div>
          </div>
        </div>
        <Spacer y={1.5} />
        <div className="flex flex-col gap-4">
          <div className="w-full overflow-hidden">
            <div className="flex flex-col">
              <p className="text-tiny text-default-700 select-none">
                Ievaddati:
              </p>
              <code
                className="text-small p-1.5 min-h-[32px]"
                style={{
                  backgroundColor: "rgba(212, 212, 216, 0.3)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {testResult.input_trimmed}
              </code>
            </div>
          </div>
        </div>
        <Spacer y={2} />
        <div className="flex gap-x-3 flex-wrap">
          <div className="md:flex-grow md:w-auto w-full overflow-hidden">
            <div className="flex flex-col">
              <p className="text-tiny text-default-700 select-none">
                Programmas izvaddati:
              </p>
              <code
                className="text-small p-1.5 min-h-[32px]"
                style={{
                  backgroundColor: "rgba(212, 212, 216, 0.3)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {testResult.subm_stdout_trimmed}
              </code>
            </div>
          </div>
          <div className="md:flex-grow md:w-auto w-full overflow-hidden">
            <div className="flex flex-col">
              <p className="text-tiny text-default-700 select-none">Atbilde:</p>
              <code
                className="text-small p-1.5 min-h-[32px]"
                style={{
                  backgroundColor: "rgba(212, 212, 216, 0.3)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {testResult.answer_trimmed}
              </code>
            </div>
          </div>
        </div>
        <Spacer y={2} />
        <div className="flex gap-4">
          <div className="w-full overflow-hidden">
            <div className="flex flex-col">
              <p className="text-tiny text-default-700 select-none">
                Pārbaudes piezīmes:
              </p>
              <code
                className="text-small p-1.5 min-h-[32px]"
                style={{
                  backgroundColor: "rgba(212, 212, 216, 0.3)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {testResult.checker_stderr_trimmed}
              </code>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
