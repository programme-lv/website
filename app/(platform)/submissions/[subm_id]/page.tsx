"use client";

import React from "react";
import {Spacer} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { getSubmission } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import ReadonlyMonacoCode from "@/components/ro-monaco-code";


export default function SubmissionPage() {
  const { subm_id } = useParams();
  const { data, isLoading, isError, error } = useQuery(
    ["submission", subm_id],
    () => getSubmission(subm_id as string),
    {enabled: !!subm_id},
  );


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

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="mt-3 flex flex-col flex-grow relative">
        <SubmInfoHeader
          possible={0} // TODO: add score
          received={0} // TODO: add score
          language={data.pr_lang.display}
          created_at={data.created_at}
          task_name={data.task_name}
          task_id={data.task_id}
          username={data.username}
          eval_status={data.curr_eval.eval_stage}
        />
        <Spacer y={3} />
        <ReadonlyMonacoCode
          code={data.content}
          lang_monaco_id={data.pr_lang.monaco_id}
        />
        <Spacer y={3} />
        {/* {data.curr_eval.compile_exec_info && (
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
                    content={data.curr_eval.compile_exec_info.stdout_trimmed+ data.curr_eval.compile_exec_info.stderr_trimmed|| ""}
                  />
                </div>
              </CardBody>
            </Card>
            <Spacer y={3} />
          </>
        )} */}
        {/* {(!data.eval_details.compile_exec_info || data.eval_details.compile_exec_info.exit_code === 0) && (
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
        )} */}
        <Spacer y={2} />
      </div>
    </Layout>
  );
};