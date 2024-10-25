"use client";

import React, { useState, useMemo, useCallback } from "react";
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

// Constants
const EXIT_SIGNAL_DESCRIPTIONS: Record<number, string> = {
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

// Helper Functions
const calculateScores = (data: any) => {
  let receivedScore = 0;
  let possibleScore = 0;

  if (data.test_groups) {
    data.test_groups.forEach((testGroup: any) => {
      possibleScore += testGroup.test_group_score;
      if (testGroup.wrong_tests === 0 && testGroup.untested_tests === 0) {
        receivedScore += testGroup.test_group_score;
      }
    });
  } else if (data.test_set) {
    const { wrong, accepted, untested } = data.test_set;

    possibleScore = wrong + accepted + untested;
    receivedScore = accepted;
  }

  return { receivedScore, possibleScore };
};

const determineVerdict = (testResult: TestResult): string => {
  if (
    testResult.subm_runtime?.exit_code !== 0 ||
    testResult.subm_runtime?.stderr_trimmed?.trim().length > 0 ||
    testResult.subm_runtime?.exit_signal
  ) {
    return "RE";
  }
  if (testResult.memory_exceeded) return "MLE";
  if (testResult.time_exceeded) return "TLE";
  if (testResult.checker_runtime?.exit_code !== 0) return "WA";

  return "AC";
};

// InfoCard Component
const InfoCard: React.FC<{
  data: any;
  receivedScore: number;
  possibleScore: number;
}> = ({ data, receivedScore, possibleScore }) => {
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

  return (
    <Card
      classNames={{ base: "border-small border-divider" }}
      radius="sm"
      shadow="none"
    >
      <CardBody>
        <div className="flex flex-wrap gap-x-6 gap-y-3 lg:gap-8 xl:gap-10 px-1">
          {infoCardEntries.map((entry) => (
            <div key={entry.label} className="flex flex-col">
              <span className="text-tiny text-default-600">{entry.label}</span>
              <span>{entry.value}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

// SingleTestResultCard Component
const SingleTestResultCard: React.FC<{ testResult: TestResult }> = ({
  testResult,
}) => {
  const verdict = useMemo(() => determineVerdict(testResult), [testResult]);

  const exitSignalDescription = useMemo(() => {
    return (
      (testResult.subm_runtime?.exit_signal &&
        EXIT_SIGNAL_DESCRIPTIONS[testResult.subm_runtime.exit_signal]) ||
      "Unknown exit signal"
    );
  }, [testResult]);

  const verdictColor = useMemo(() => {
    switch (verdict) {
      case "AC":
        return "success";
      case "RE":
        return "secondary";
      case "MLE":
      case "TLE":
      case "WA":
        return "danger";
      default:
        return "default";
    }
  }, [verdict]);

  const verdictText = useMemo(() => {
    const texts: Record<string, string> = {
      AC: "Atbilde ir pareiza",
      MLE: "Pārsniegts atmiņas limits",
      TLE: "Pārsniegts izpildes laiks",
      WA: "Atbilde ir nepareiza",
      RE: "Izpildes kļūda",
    };

    return texts[verdict] || "Nav sasniegts";
  }, [verdict]);

  if (testResult.reached === false) {
    return (
      <Card
        key={`${testResult.test_id}-not-reached`}
        className="border-small border-divider"
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <TestResultHeader testResult={testResult} verdict={verdict} />
        </CardBody>
      </Card>
    );
  }

  return (
    <div
      key={testResult.test_id}
      className="p-2 border-small border-divider rounded-md"
    >
      <TestResultHeader testResult={testResult} verdict={verdict} />
      {/* <Spacer y={1.5} /> */}
      {verdict === "RE" && (
        <>
          <div className="flex flex-col gap-4">
            <RuntimeInfo testResult={testResult} />
          </div>
          <Spacer y={2} />
          <div className="flex gap-4">
            <OutputSection
              content={testResult.subm_runtime?.stderr_trimmed}
              title="Izpildes kļūdas ziņojums:"
            />
            <OutputSection
              content={testResult.subm_runtime?.exit_code?.toString()}
              title="Izejas kods:"
            />
            {testResult.subm_runtime?.exit_signal && (
              <OutputSection
                content={`${testResult.subm_runtime.exit_signal} : ${exitSignalDescription}`}
                title="Izejas signāls:"
              />
            )}
          </div>
        </>
      )}
      {verdict !== "RE" && (
        <>
          <div className="flex flex-col gap-4">
            <OutputSection
              content={testResult.input_trimmed}
              title="Ievaddati:"
            />
            <OutputSection
              content={testResult.subm_runtime?.stdout_trimmed}
              title="Programmas izvaddati:"
            />
            <OutputSection
              content={testResult.answer_trimmed}
              title="Atbilde:"
            />
            <OutputSection
              content={testResult.checker_runtime?.stderr_trimmed}
              title="Pārbaudes piezīmes:"
            />
          </div>
        </>
      )}
    </div>
  );
};

// TestResultHeader Component
const TestResultHeader: React.FC<{
  testResult: TestResult;
  verdict: string;
}> = ({ testResult, verdict }) => {
  const verdictColor = cn({
    "text-success-600": verdict === "AC",
    "text-danger-600":
      verdict === "WA" || verdict === "MLE" || verdict === "TLE",
    "text-secondary-600": verdict === "RE",
  });

  const chipColor = useMemo(() => {
    switch (verdict) {
      case "AC":
        return "success";
      case "RE":
        return "secondary";
      case "WA":
      case "MLE":
      case "TLE":
        return "danger";
      default:
        return "default";
    }
  }, [verdict]);

  const chipLabel = useMemo(() => {
    const labels: Record<string, string> = {
      AC: "Atbilde ir pareiza",
      MLE: "Pārsniegts atmiņas limits",
      TLE: "Pārsniegts izpildes laiks",
      WA: "Atbilde ir nepareiza",
      RE: "Izpildes kļūda",
    };

    return labels[verdict] || "Nav sasniegts";
  }, [verdict]);

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex gap-2 items-center">
        <span className="text-sm">Tests</span> #{testResult.test_id}
        <Chip color={chipColor} size="sm" variant="flat">
          {chipLabel}
        </Chip>
      </div>
      <div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
        {testResult.subm_runtime?.cpu_time_millis && (
          <div className="flex gap-1 items-center">
            <p className="text-small text-default-700 whitespace-nowrap">
              Izpildes laiks:
            </p>
            <code className="whitespace-nowrap h-[20px]">
              {testResult.subm_runtime.cpu_time_millis}ms
            </code>
          </div>
        )}
        {testResult.subm_runtime?.mem_kibi_bytes && (
          <div className="flex gap-1 items-center">
            <p className="text-small text-default-700 whitespace-nowrap">
              Patērētā atmiņa:
            </p>
            <code className="whitespace-nowrap h-[20px]">
              {(testResult.subm_runtime.mem_kibi_bytes / 1024).toFixed(2)} MB
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

// OutputSection Component
const OutputSection: React.FC<{ title: string; content?: string | null }> = ({
  title,
  content,
}) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col">
        <p className="text-tiny text-default-700 select-none">{title}</p>
        <code
          className="text-small p-1.5 min-h-[32px] break-words"
          style={{
            backgroundColor: "rgba(212, 212, 216, 0.3)",
            whiteSpace: "pre-wrap",
          }}
        >
          {content || "N/A"}
        </code>
      </div>
    </div>
  );
};

// RuntimeInfo Component
const RuntimeInfo: React.FC<{ testResult: TestResult }> = ({ testResult }) => {
  return (
    <div className="flex flex-col gap-2">
      {testResult.subm_runtime?.cpu_time_millis && (
        <div className="flex gap-1 items-center">
          <p className="text-small text-default-700 whitespace-nowrap">
            Izpildes laiks:
          </p>
          <code className="whitespace-nowrap h-[20px]">
            {testResult.subm_runtime.cpu_time_millis}ms
          </code>
        </div>
      )}
      {testResult.subm_runtime?.mem_kibi_bytes && (
        <div className="flex gap-1 items-center">
          <p className="text-small text-default-700 whitespace-nowrap">
            Patērētā atmiņa:
          </p>
          <code className="whitespace-nowrap h-[20px]">
            {(testResult.subm_runtime.mem_kibi_bytes / 1024).toFixed(2)} MB
          </code>
        </div>
      )}
    </div>
  );
};

// Main SubmissionView Component
const SubmissionView: React.FC = () => {
  const { subm_id } = useParams();
  const { data, isLoading, isError, error } = useQuery(
    ["submission", subm_id],
    () => getSubmission(subm_id as string),
    {
      enabled: !!subm_id,
    },
  );

  const [editorHeight, setEditorHeight] = useState<number>(400); // Initial height

  const { receivedScore, possibleScore } = useMemo(() => {
    if (data) {
      return calculateScores(data);
    }

    return { receivedScore: 0, possibleScore: 0 };
  }, [data]);

  const sortedTestGroups = useMemo(() => {
    if (data?.test_groups) {
      return [...data.test_groups].sort(
        (a: any, b: any) => a.test_group_id - b.test_group_id,
      );
    }

    return [];
  }, [data]);

  const updateHeight = useCallback((editor: any) => {
    const contentHeight = Math.max(100, editor.getContentHeight());

    setEditorHeight(contentHeight + 10);
    editor.layout({ height: contentHeight });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        Error loading submission:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!data) {
    return <div>No submission data found.</div>;
  }

  return (
    <div className="mt-3 flex flex-col flex-grow relative">
      <InfoCard
        data={data}
        possibleScore={possibleScore}
        receivedScore={receivedScore}
      />
      <Spacer y={3} />
      <Card
        classNames={{ base: "border-small border-divider" }}
        radius="sm"
        shadow="none"
      >
        <CardBody>
          <MonacoEditor
            height={`${editorHeight}px`}
            language={data.p_lang_monaco_id}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              readOnly: true,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
                alwaysConsumeMouseWheel: false,
              },
              overviewRulerLanes: 0,
              scrollBeyondLastLine: false,
            }}
            theme="vs-dark"
            value={data.subm_content}
            onMount={updateHeight}
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
                  className="text-small p-1.5 min-h-[32px] break-words"
                  style={{
                    backgroundColor: "rgba(212, 212, 216, 0.3)",
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
      {sortedTestGroups.length > 0 && (
        <div className="border-small border-divider rounded-md bg-white">
          <div className="px-0 lg:px-1 p-0 py-1">
            <Accordion
              fullWidth
              isCompact
              defaultExpandedKeys={["1"]}
              variant="light"
            >
              {sortedTestGroups.map((testGroup: any) => (
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
                            #{String(testGroup.test_group_id).padStart(2, "0")}
                          </span>
                        </div>
                        <div>
                          <span className="whitespace-nowrap">
                            ({" "}
                            <span className="font-mono">
                              {testGroup.subtasks.join(", ")}
                            </span>
                            .
                            <span className="text-small text-default-600">
                              {" "}
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
                            testGroup.untested_tests === 0
                              ? "text-success-600"
                              : testGroup.wrong_tests > 0
                                ? "text-danger-600"
                                : "text-warning-500"
                          }`}
                        >
                          <span className="font-mono">
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
                    className="overflow-x-auto flex flex-col gap-2 pb-2 max-w-full w-full relative rounded-none"
                    // style={{ backgroundColor: "#f8f8f8" }}
                  >
                    {data.test_results
                      .filter((testResult: TestResult) =>
                        testResult.test_groups.includes(
                          testGroup.test_group_id,
                        ),
                      )
                      .map((testResult: TestResult) => (
                        <SingleTestResultCard
                          key={testResult.test_id}
                          testResult={testResult}
                        />
                      ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
      {data.test_set &&
        data.test_results &&
        data.test_results.map((testResult: TestResult) => (
          <React.Fragment key={testResult.test_id}>
            <SingleTestResultCard testResult={testResult} />
            <Spacer y={2} />
          </React.Fragment>
        ))}
      <Spacer y={2} />
    </div>
  );
};

export default SubmissionView;
