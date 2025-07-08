import { Spacer } from "@heroui/react";
import { notFound } from "next/navigation";

import { getExec } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "@/components/subm-info-header";
import CodeBlock from "@/components/code-block";
import { Execution } from "@/types/exec";
import { DetailedSubmView } from "@/types/subm";
import "katex/dist/katex.min.css";
import TestResultTable from "@/components/test-result-table";
import ShikiCodeBlock from "@/components/ro-shiki-code";
import { getSubmission } from "@/lib/fetch-subm";

export default async function Page({
  params,
}: {
  params: Promise<{ subm_id: string }>
}) {
    try {
        // Await the params
        const { subm_id } = await params;
        
        // Fetch submission data
        let submData: DetailedSubmView;
        try {
            submData = await getSubmission(subm_id);
        } catch (error) {
            return (
                <div>
                    Error loading submission:{" "}
                    {error instanceof Error ? error.message : "Unknown error"}
                </div>
            );
        }

        if (!submData) {
            notFound();
        }

        const breadcrumbs = [
            { label: "Iesūtījumi", href: "/submissions" },
            { label: subm_id, href: `/submissions/${subm_id}` },
        ];

        if (!submData.curr_eval) {
            return (
                <Layout breadcrumbs={breadcrumbs} active="submissions">
                    <div>No evaluation data was found.</div>
                </Layout>
            );
        }

        // Fetch execution data
        let execData: Execution | null = null;
        if (submData.curr_eval.eval_uuid) {
            try {
                execData = await getExec(submData.curr_eval.eval_uuid);
            } catch (error) {
                return (
                    <div>
                        Error loading execution:{" "}
                        {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                );
            }
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
                    <div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
                        {!submData.content && (
                            <div className="text-small text-default-900 select-none mb-1">
                                Risinājuma kods ir redzams tikai tiem lietotājiem, kuri paši ir atrisinājuši šo uzdevumu.
                            </div>
                        )}
                        {submData.content && (
                            <ShikiCodeBlock lang={submData.pr_lang.monaco_id}>
                                {submData.content}
                            </ShikiCodeBlock>
                        )}
                    </div>
                    <Spacer y={3} />
                    {execData.subm_comp && (
                        <>
                            <div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
                                <p className="text-small text-default-900 select-none mb-1">
                                    Kompilācijas izvaddati:
                                </p>
                                <CodeBlock content={execData.subm_comp.out + execData.subm_comp.err || ""}/>
                            </div>
                            <Spacer y={3} />
                        </>
                    )}
                    {(!execData.subm_comp || execData.subm_comp.exit === 0) && (
                        <div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
                            <TestResultTable visible_details={!!submData.content} subm_eval={submData.curr_eval} test_results={execData.test_res.map(x => ({ ...x }))} />
                        </div>
                    )}
                    <Spacer y={2} />
                </div>
            </Layout>
        );
    } catch (error) {
        return (
            <div>
                An unexpected error occurred:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
            </div>
        );
    }
}
