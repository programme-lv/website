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

import { getSubmission } from "@/lib/subms";
import { cn } from "@/components/cn";
import { TestResult } from "@/types/proglv";
import { statusTranslations } from "@/components/subm-table/helpful-constants";

export default function SubmissionView() {
  const { subm_id } = useParams();
  let { data } = useQuery(["submission", subm_id], () =>
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
  const exitSignalDescriptions = {
    1: "SIGHUP - Terminate - Hang up controlling terminal or process",
    2: "SIGINT - Terminate - Interrupt from keyboard, Control-C",
    3: "SIGQUIT - Dump - Quit from keyboard, Control-\\",
    4: "SIGILL - Dump - Illegal instruction",
    5: "SIGTRAP - Dump - Breakpoint for debugging",
    6: "SIGABRT/SIGIOT - Dump - Abnormal termination / Equivalent to SIGABRT",
    7: "SIGBUS - Dump - Bus error",
    8: "SIGFPE - Dump - Floating-point exception",
    9: "SIGKILL - Terminate - Forced-process termination",
    10: "SIGUSR1 - Terminate - Available to processes",
    11: "SIGSEGV - Dump - Invalid memory reference",
    12: "SIGUSR2 - Terminate - Available to processes",
    13: "SIGPIPE - Terminate - Write to pipe with no readers",
    14: "SIGALRM - Terminate - Real-timer clock",
    15: "SIGTERM - Terminate - Process termination",
    16: "SIGSTKFLT - Terminate - Coprocessor stack error",
    17: "SIGCHLD - Ignore - Child process stopped or terminated or got a signal if traced",
    18: "SIGCONT - Continue - Resume execution, if stopped",
    19: "SIGSTOP - Stop - Stop process execution, Ctrl-Z",
    20: "SIGTSTP - Stop - Stop process issued from tty",
    21: "SIGTTIN - Stop - Background process requires input",
    22: "SIGTTOU - Stop - Background process requires output",
    23: "SIGURG - Ignore - Urgent condition on socket",
    24: "SIGXCPU - Dump - CPU time limit exceeded",
    25: "SIGXFSZ - Dump - File size limit exceeded",
    26: "SIGVTALRM - Terminate - Virtual timer clock",
    27: "SIGPROF - Terminate - Profile timer clock",
    28: "SIGWINCH - Ignore - Window resizing",
    29: "SIGIO/SIGPOLL - Terminate - I/O now possible / Equivalent to SIGIO",
    30: "SIGPWR - Terminate - Power supply failure",
    31: "SIGSYS/SIGUNUSED - Dump - Bad system call / Equivalent to SIGSYS",
  };

  let verdict = "AC";
  const nonZeroExitCode =
    typeof testResult.subm_exit_code === "number" &&
    testResult.subm_exit_code !== 0;
  const hasStderr =
    typeof testResult.subm_stderr_trimmed === "string" &&
    testResult.subm_stderr_trimmed.trim().length > 0;
  const hasExitSignal =
    typeof testResult.subm_exit_signal === "number" &&
    testResult.subm_exit_signal !== 0;

  if (testResult.subm_exit_code !== 0 || hasStderr || hasExitSignal)
    verdict = "RE";
  else if (testResult.memory_limit_exceeded) verdict = "MLE";
  else if (testResult.time_limit_exceeded) verdict = "TLE";
  else if (testResult.checker_exit_code !== 0) verdict = "WA";

  if (testResult.time_limit_exceeded)
    testResult.subm_cpu_time_millis = undefined;
  if (testResult.memory_limit_exceeded)
    testResult.subm_mem_kibi_bytes = undefined;

  let exitSignalDescription: string = "Unknown exit signal";

  if (
    testResult.subm_exit_signal &&
    exitSignalDescriptions[
      testResult.subm_exit_signal as keyof typeof exitSignalDescriptions
    ]
  ) {
    exitSignalDescription =
      exitSignalDescriptions[
        testResult.subm_exit_signal as keyof typeof exitSignalDescriptions
      ];
  }

  if (nonZeroExitCode || hasStderr || hasExitSignal) {
    return (
      <Card
        key={testResult.test_id + "-error"}
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
              {testResult.subm_cpu_time_millis && (
                <div className="flex gap-1 items-center">
                  <p className="text-small text-default-700 whitespace-nowrap">
                    Izpildes laiks:
                  </p>
                  <code className="whitespace-nowrap h-[20px]">
                    {testResult.subm_cpu_time_millis}ms
                  </code>
                </div>
              )}
              {testResult.subm_mem_kibi_bytes && (
                <div className="flex gap-1 items-center">
                  <p className="text-small text-default-700 whitespace-nowrap">
                    Patērētā atmiņa:
                  </p>
                  <code className="whitespace-nowrap h-[20px]">
                    {Math.ceil(
                      testResult.subm_mem_kibi_bytes * 0.001024 * 100,
                    ) / 100}
                    MB
                  </code>
                </div>
              )}
            </div>
          </div>
          <Spacer y={1.5} />
          <div className="flex gap-4">
            <div className="w-full overflow-hidden">
              <div className="flex flex-col">
                <p className="text-tiny text-default-700 select-none">
                  Izpildes kļūdas ziņojums:
                </p>
                <code
                  className="text-small p-1.5 min-h-[32px]"
                  style={{
                    backgroundColor: "rgba(212, 212, 216, 0.3)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {testResult.subm_stderr_trimmed}
                </code>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-full overflow-hidden">
              <div className="flex flex-col">
                <p className="text-tiny text-default-700 select-none">
                  Izejas kods:
                </p>
                <code
                  className="text-small p-1.5 min-h-[32px]"
                  style={{
                    backgroundColor: "rgba(212, 212, 216, 0.3)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {testResult.subm_exit_code}
                </code>
              </div>
            </div>
          </div>
          {testResult.subm_exit_signal && (
            <>
              <Spacer y={2} />
              <div className="flex gap-4">
                <div className="w-full overflow-hidden">
                  <div className="flex flex-col">
                    <p className="text-tiny text-default-700 select-none">
                      Izejas signāls:
                    </p>
                    <code
                      className="text-small p-1.5 min-h-[32px]"
                      style={{
                        backgroundColor: "rgba(212, 212, 216, 0.3)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {testResult.subm_exit_signal} : {exitSignalDescription}
                    </code>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    );
  }
  if (testResult.reached === false) {
    return (
      <Card
        key={testResult.test_id + "-error"}
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
              {testResult.subm_cpu_time_millis && (
                <div className="flex gap-1 items-center">
                  <p className="text-small text-default-700 whitespace-nowrap">
                    Izpildes laiks:
                  </p>
                  <code className="whitespace-nowrap h-[20px]">
                    {testResult.subm_cpu_time_millis}ms
                  </code>
                </div>
              )}
              {testResult.subm_mem_kibi_bytes && (
                <div className="flex gap-1 items-center">
                  <p className="text-small text-default-700 whitespace-nowrap">
                    Patērētā atmiņa:
                  </p>
                  <code className="whitespace-nowrap h-[20px]">
                    {Math.ceil(
                      testResult.subm_mem_kibi_bytes * 0.001024 * 100,
                    ) / 100}
                    MB
                  </code>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

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
            {testResult.subm_cpu_time_millis && (
              <div className="flex gap-1 items-center">
                <p className="text-small text-default-700 whitespace-nowrap">
                  Izpildes laiks:
                </p>
                <code className="whitespace-nowrap h-[20px]">
                  {testResult.subm_cpu_time_millis}ms
                </code>
              </div>
            )}
            {testResult.subm_mem_kibi_bytes && (
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
            )}
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
