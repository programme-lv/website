"use client";

import React from "react";
import {Card, CardBody, Spacer} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { getExec, getSubmission } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import ReadonlyMonacoCode from "@/components/ro-monaco-code";
import { calculateGroupScores, calculateTestScores } from "@/lib/score-subm";
import CodeBlock from "@/components/code-block";


export default function SubmissionPage() {
  const { subm_id } = useParams();
  const { data: submData, isLoading: submIsLoading, isError: submIsError, error: submError } = useQuery(
    ["submission", subm_id],
    () => getSubmission(subm_id as string),
    {enabled: !!subm_id},
  );
  const { data: execData, isLoading: execIsLoading, isError: execIsError, error: execError } = useQuery(
    ["exec", submData?.curr_eval?.eval_uuid],
    () => getExec(submData?.curr_eval?.eval_uuid as string),
    { 
      enabled: !!submData?.curr_eval?.eval_uuid,
    }
  );

  console.log(execData);
  console.log(submData);
  console.log(submIsLoading);
  console.log(execIsLoading);
  console.log(execIsError);
  console.log(execError);

  console.log(submIsError);
  console.log(submError); 

  console.log(submData?.curr_eval.eval_uuid);


  if (submIsError) {
    return (
      <div>
        Error loading submission:{" "}
        {submError instanceof Error ? submError.message : "Unknown error"}
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Iesūtījumi", href: "/submissions" },
    { label: subm_id as string, href: `/submissions/${subm_id}` },
  ];

  if (submIsLoading || execIsLoading) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="submissions">
        <></>
      </Layout>
    );
  }

  if (!submData) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="submissions">
        <div>No submission data was found.</div>
      </Layout>
    );
  }

  if (!execData) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="submissions">
        <div>No execution data was found.</div>
      </Layout>
    );
  }

  let possible = 0;
  let received = 0;
  if (submData.curr_eval.score_unit === "test") {
    const { accepted, untested, wrong, testing } = calculateTestScores(submData.curr_eval.test_verdicts);
    possible = accepted + untested + testing + wrong;
    received = accepted;
  } else if (submData.curr_eval.score_unit === "group") {
    const { accepted_points, wrong_points, untested_points, testing_points } = calculateGroupScores(submData.curr_eval.test_groups, submData.curr_eval.test_verdicts);
    possible = accepted_points + wrong_points + untested_points + testing_points;
    received = accepted_points;
  }

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="mt-3 flex flex-col flex-grow relative">
        <SubmInfoHeader
          possible={possible}
          received={received}
          language={submData.pr_lang.display}
          created_at={submData.created_at}
          task_name={submData.task_name}
          task_id={submData.task_id}
          username={submData.username}
          eval_status={submData.curr_eval.eval_stage}
        />
        <Spacer y={3} />
        <ReadonlyMonacoCode
          code={submData.content}
          lang_monaco_id={submData.pr_lang.monaco_id}
        />
        <Spacer y={3} />
        {execData.subm_comp && (
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
                    content={execData.subm_comp.out+ execData.subm_comp.err|| ""}
                  />
                </div>
              </CardBody>
            </Card>
            <Spacer y={3} />
          </>
        )}
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