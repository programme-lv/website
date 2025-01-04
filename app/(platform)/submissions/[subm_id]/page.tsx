"use client";

import React from "react";
import { Accordion, AccordionItem, Card, CardBody, Spacer } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { getExec, getSubmission } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import ReadonlyMonacoCode from "@/components/ro-monaco-code";
import { calculateGroupScores, calculateTestScores } from "@/lib/score-subm";
import CodeBlock from "@/components/code-block";
import { Submission, Verdict } from "@/types/proglv";
import EvalTestResultCard from "@/components/eval-test-result-card";
import { Execution, TestRes } from "@/types/exec";


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

  if (submIsError) {
    return (
      <div>
        Error loading submission:{" "}
        {submError instanceof Error ? submError.message : "Unknown error"}
      </div>
    );
  }

  if (execIsError) {
    return (
      <div>
        Error loading execution:{" "}
        {execError instanceof Error ? execError.message : "Unknown error"}
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
            {submData.curr_eval.score_unit === "group" &&
              <TestGroupResults subm={submData} exec={execData} />}
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

  const component = [];

  for (let i = 0; i < test_count; i++) {
    component.push(
      <React.Fragment key={i}>
        <EvalTestResultCard mem_lim_kib={exec.params.mem_kib} cpu_lim_ms={exec.params.cpu_ms}
          test_id={i + 1} verdict={subm.curr_eval.test_verdicts[i]} test_ans={exec.test_res[i].ans || "N/A"}
          subm_exec={exec.test_res[i].subm_rd} tlib_exec={exec.test_res[i].tlib_rd}
        />
        <Spacer y={2} />
      </React.Fragment>
    )
  }

  return (<>{component}</>);
}
function TestGroupResults({ subm, exec }: { subm: Submission, exec: Execution }) {
  const tg_props: { [tg_id: number]: {
    cpu_lim_ms: number,
    mem_lim_kib: number,
    tg_id: number,
    tg_subtasks: number[],
    tg_points: number,
    tg_test_verdicts: Verdict[],
    tg_test_results: TestRes[],
  } } = {};

  for (let i = 0; i < subm.curr_eval.test_groups.length; i++) {
    // to get tg test verdicts we need to take the indices in test group from subm.curr_eval.test_groups
    const tg_test_ids = subm.curr_eval.test_groups[i].tg_tests;
    const tg_test_verdicts = tg_test_ids.map(tg_test_id => subm.curr_eval.test_verdicts[tg_test_id - 1]);
    const tg_test_results = tg_test_ids.map(tg_test_id => exec.test_res[tg_test_id - 1]);

    tg_props[i] = {
      cpu_lim_ms: exec.params.cpu_ms,
      mem_lim_kib: exec.params.mem_kib,
      tg_id: i+1,
      tg_subtasks: subm.curr_eval.test_groups[i].subtasks,
      tg_points: subm.curr_eval.test_groups[i].points,
      tg_test_verdicts: tg_test_verdicts,
      tg_test_results: tg_test_results,
    };
  }

  return (
    <div className="border-small border-divider rounded-small bg-white">
    <Accordion
        fullWidth
        isCompact
        defaultExpandedKeys={["1"]}
        variant="light"
    >
      {subm.curr_eval.test_groups.map((tg, index) => {
        const props = tg_props[index];
        const { untested, wrong, testing } = calculateTestScores(props.tg_test_verdicts);

        const scoreColor =
            wrong === 0 && untested === 0 && testing === 0
                ? "text-success-700"
                : wrong > 0
                    ? "text-danger-600"
                    : "text-warning-500";

        const displayedScore = wrong === 0 && untested === 0 ? props.tg_points : 0;

        return (
          <AccordionItem
              key={props.tg_id}
              classNames={{ startContent: "w-[80%]" }}
              startContent={
                  <div className="flex flex-grow justify-start gap-x-3 items-center flex-wrap">
                      <div className="ms-1 flex gap-x-2">
                          <div className="whitespace-nowrap">
                              <span className="text-small text-default-600">Testu grupa </span>
                              <span className="font-mono">
                                  #{String(props.tg_id).padStart(2, "0")}
                              </span>
                          </div>
                          <div>
                              <span className="whitespace-nowrap">
                                  <span className="text-small text-default-600">(</span>
                                  <span className="font-mono">{props.tg_subtasks.join(", ")}.</span>
                                  <span className="text-small text-default-600"> apakšuzd.</span>
                                  <span className="text-small text-default-600">)</span>
                              </span>
                          </div>
                      </div>
                      <div>
                          <span className={`whitespace-nowrap`}>
                              <span className={`font-mono inline-block ${scoreColor}`}>
                                  {String(displayedScore).padStart(2, "0")}
                              </span>
                              <span className="text-default-600 text-sm"> no </span>
                              <span className={`font-mono inline-block`}>
                                  {String(props.tg_points).padStart(2, "0")}
                              </span>
                          </span>
                          <span className="text-small text-default-600"> p.</span>
                      </div>
                  </div>
              }
          >
              <div className="overflow-x-auto flex flex-col gap-2 pb-2 max-w-full w-full relative rounded-none">
                  {props.tg_test_results
                      .map((testResult: TestRes) => (
                          <EvalTestResultCard
                              key={testResult.id}
                              mem_lim_kib={props.mem_lim_kib}
                              cpu_lim_ms={props.cpu_lim_ms}
                              test_id={testResult.id}
                              verdict={props.tg_test_verdicts[testResult.id - 1]}
                              test_ans={testResult.ans || "N/A"}
                              subm_exec={testResult.subm_rd}
                              tlib_exec={testResult.tlib_rd}
                          />
                      ))}
              </div>
          </AccordionItem>
        );
      })}
    </Accordion></div>
  )
}