"use client";

import React, { useState } from "react";
import { Accordion, AccordionItem, Card, CardBody, Spacer, Button, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

import { getExec, getSubmission } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import ReadonlyMonacoCode from "@/components/ro-monaco-code";
import CodeBlock from "@/components/code-block";
import TestDetailsModal, { full_verdicts, verdict_colors } from "@/components/test-details-modal";
import { Execution, TestRes } from "@/types/exec";
import { DetailedSubmView } from "@/types/subm";
import GenericTable, { Column } from "@/components/generic-table";
import { renderMdLite } from "@/lib/render-md";
import "katex/dist/katex.min.css";


export default function SubmissionPage() {
  const { subm_id } = useParams();
  const { data: submData, isLoading: submIsLoading, isError: submIsError, error: submError } = useQuery(
    ["submission", subm_id],
    () => getSubmission(subm_id as string) as Promise<DetailedSubmView>,
    { enabled: !!subm_id },
  );
  const { data: execData, isLoading: execIsLoading, isError: execIsError, error: execError } = useQuery(
    ["exec", submData?.curr_eval?.eval_uuid],
    () => getExec(submData?.curr_eval?.eval_uuid as string) as Promise<Execution>,
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

  let possible = submData.curr_eval.score_info.possible;
  let received = submData.curr_eval.score_info.received;

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="m-3 flex flex-col flex-grow relative">
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
          <div className="bg-white p-3 rounded-small border-small border-divider overflow-x-auto">
            <TestResultTable subm={submData} exec={execData} />
          </div>
        )}
        <Spacer y={2} />
      </div>
    </Layout>
  );
};

function TestResultTable({ subm, exec }: { subm: DetailedSubmView, exec: Execution }) {
  const [selectedTest, setSelectedTest] = useState<TestRes | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const openTestDetails = (test: TestRes) => {
    setSelectedTest(test);
    onOpen();
  };

  const testgroups = subm.curr_eval.test_groups.map((tg, idx) => ({...tg, id:idx+1}));
  const test_results = exec.test_res.map(x=>({...x, id:x.id+1}));

  const columns: Column<typeof test_results[0]>[] = [
    {
      key: "id",
      header: "Tests #",
      width: "80px",
      render: (test) => test.id
    },
    {
      key: "test_group",
      header: "Grupa",
      width: "110px",
      render: (test) => {

        const tgs = testgroups.filter(tg=>tg.tg_tests.some(x=>x[0]<=test.id&&x[1]>=test.id));
        return tgs.map(x => `${x.id}.`).join(", ");
      }
    },
    {
      key: "verdict",
      header: "Vērtējums",
      width: "170px",
      render: (test) => (
        <span className={`whitespace-nowrap ${verdict_colors[subm.curr_eval.verdicts[test.id-1]] || ''}`}>
          {full_verdicts[subm.curr_eval.verdicts[test.id-1]] || 'Nezināms'}
        </span>
      )
    },
    {
      key: "cpu",
      header: "CPU laiks [s]",
      width: "110px",
      render: (test) => test.subm_rd?.cpu_ms ? (test.subm_rd.cpu_ms / 1000).toFixed(2) : "N/A"
    },
    {
      key: "mem",
      header: "Atmiņa [MiB]",
      width: "110px",
      render: (test) => test.subm_rd?.mem_kib ? (test.subm_rd.mem_kib / 1024).toFixed(1) : "N/A"
    },
    {
      key: "details",
      header: "Detaļas",
      width: "100px",
      render: (test) => (
        <Button 
          variant="light" 
          size="sm" 
          onPress={() => openTestDetails(test)}
          aria-label="Atvērt testa detaļas"
          className="min-w-0 p-1 h-auto"
        >
          <span className="text-default-500">👁️</span>
        </Button>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-col gap-4">

        {subm.curr_eval.subtasks.map((subtask, i)=>(
          <div key={subtask.description}>
            <p className="font-normal text-default-foreground pl-1">
              {i+1}. apakšuzdevums: "<span dangerouslySetInnerHTML={{ __html: renderMdLite(subtask.description).replaceAll("<p>", "").replaceAll("</p>", "") }} />"
            </p>
            <GenericTable
              data={test_results.filter(test=>subtask.st_tests.some(x=>x[0]<=test.id&&x[1]>=test.id))}
              columns={columns}
              keyExtractor={(test) => subtask.description + "_" + test.id.toString()}
              className="w-full max-w-[650px]"
              rowHeight="compact"
            />
          </div>
        ))}
      </div>

      <TestDetailsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        test={selectedTest}
        submission={subm}
      />
    </div>
  );
}