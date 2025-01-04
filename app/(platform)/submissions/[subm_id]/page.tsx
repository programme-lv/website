"use client";

import React from "react";
import { Card, CardBody, Spacer } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { getExec, getSubmission } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import ReadonlyMonacoCode from "@/components/ro-monaco-code";
import { calculateGroupScores, calculateTestScores } from "@/lib/score-subm";
import CodeBlock from "@/components/code-block";
import { Submission } from "@/types/proglv";
import EvalTestResultCard from "@/components/eval-test-result-card";
import { Execution } from "@/types/exec";


export default function SubmissionPage() {
  const { subm_id } = useParams();
  const { data: submData, isLoading: submIsLoading, isError: submIsError, error: submError } = useQuery(
    ["submission", subm_id],
    () => getSubmission(subm_id as string),
    { enabled: !!subm_id },
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

  if (!submData.curr_eval) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="submissions">
        <div>No evaluation data was found.</div>
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
                    content={execData.subm_comp.out + execData.subm_comp.err || ""}
                  />
                </div>
              </CardBody>
            </Card>
            <Spacer y={3} />
          </>
        )}
        {(!execData.subm_comp || execData.subm_comp.exit === 0) && (
          <>
            {/* {submData.curr_eval.test_groups.length > 0 && (
              <div className="border-small border-divider rounded-md bg-white">
                <div className="px-0 lg:px-1 p-0 py-1">
                  <EvalTestgroupAccordion testGroups={sortedTestGroups} testResults={reached_tests} time_lim={data.eval_details.cpu_time_limit_millis} mem_lim={data.eval_details.memory_limit_kibi_bytes} />
                </div>
              </div>
            )} */}
            {submData.curr_eval.score_unit === "test" &&
              <TestResults subm={submData} exec={execData} />}
          </>
        )}
        <Spacer y={2} />
      </div>
    </Layout>
  );
};

function TestResults({ subm, exec }: { subm: Submission, exec: Execution }) {
  const eval_tc = subm.curr_eval.test_verdicts; // evaluation test count
  const exec_tc = exec.test_res; // execution test count
  const test_count = Math.min(eval_tc.length, exec_tc.length);

  let component = [];

  for (let i = 0; i < test_count; i++) {
    component.push(
      <React.Fragment key={i}>
        <EvalTestResultCard mem_lim_kib={exec.params.mem_kib} cpu_lim_ms={exec.params.cpu_ms}
          test_id={i + 1} verdict={subm.curr_eval.test_verdicts[i]} test_inp={exec.test_res[i].inp || "N/A"} test_ans={exec.test_res[i].ans || "N/A"}
          subm_exec={exec.test_res[i].subm_rd} tlib_exec={exec.test_res[i].tlib_rd}
        />
        <Spacer y={2} />
      </React.Fragment>
    )
  }

  return (<>{component}</>);
}