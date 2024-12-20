"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  Spacer,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { getSubmission } from "@/lib/subms";
import { TestResult } from "@/types/proglv";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import ReadonlyMonacoCode from "@/components/ro-monaco-code";
import CodeBlock from "@/components/code-block";
import EvalTestResultCard from "@/components/eval-test-result-card";
import EvalTestgroupAccordion from "@/components/eval-group-accordion";

// Helper Functions
const calculateScores = (data: any) => {
  let receivedScore = 0;
  let possibleScore = 0;

  if (data.test_groups && data.test_groups.length > 0) {
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


  if (isError) {
    return (
      <div>
        Error loading submission:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Iesūtījumi", href: "/submissions" },
    { label: subm_id as string, href: `/submissions/${subm_id}` },
  ];

  if (isLoading) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="submissions">
        <></>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="submissions">
        <div>No submission data found.</div>
      </Layout>
    );
  }

  const reached_tests = data.test_results.filter((test: TestResult) => test.reached);

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="mt-3 flex flex-col flex-grow relative">
        <SubmInfoHeader
          possible={possibleScore}
          received={receivedScore}
          language={data.p_lang_display_name}
          created_at={data.created_at}
          task_name={data.task_name}
          task_id={data.task_id}
          username={data.username}
          eval_status={data.eval_status}
        />
        <Spacer y={3} />
        <ReadonlyMonacoCode
          code={data.subm_content}
          lang_monaco_id={data.p_lang_monaco_id}
        />
        <Spacer y={3} />
        {data.eval_details.compile_exec_info && (
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
                  <CodeBlock
                    content={data.eval_details.compile_exec_info.stdout_trimmed+ data.eval_details.compile_exec_info.stderr_trimmed|| ""}
                  />
                </div>
              </CardBody>
            </Card>
            <Spacer y={3} />
          </>
        )}
        {(!data.eval_details.compile_exec_info || data.eval_details.compile_exec_info.exit_code === 0) && (
          <>
            {sortedTestGroups.length > 0 && (
              <div className="border-small border-divider rounded-md bg-white">
                <div className="px-0 lg:px-1 p-0 py-1">
                  <EvalTestgroupAccordion testGroups={sortedTestGroups} testResults={reached_tests} time_lim={data.eval_details.cpu_time_limit_millis} mem_lim={data.eval_details.memory_limit_kibi_bytes} />
                </div>
              </div>
            )}
            {data.test_set && !sortedTestGroups.length &&
              reached_tests.map((testResult: TestResult) => (
                <React.Fragment key={testResult.test_id}>
                  <EvalTestResultCard testResult={testResult} time_lim={data.eval_details.cpu_time_limit_millis} mem_lim={data.eval_details.memory_limit_kibi_bytes} />
                  <Spacer y={2} />
                </React.Fragment>
              ))}
          </>
        )}
        <Spacer y={2} />
      </div>
    </Layout>
  );
};

export default SubmissionView;
