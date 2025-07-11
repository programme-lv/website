import { getExec } from "@/lib/subms";
import Layout from "@/components/layout";
import SubmInfoHeader from "./header";
import CodeBlock from "@/components/code-block";
import "katex/dist/katex.min.css";
import TestResultTable from "@/components/test-result-table";
import ShikiCodeBlock from "@/components/ro-shiki-code";
import { getSubmission } from "@/lib/fetch-subm";

export default async function Page({
	params,
}: {
	params: Promise<{ subm_id: string }>;
}) {
	const { subm_id } = await params;

	const submData = await getSubmission(subm_id);
	if (!submData || !submData.curr_eval)
		return <>Error: submission data is empty.</>;

	const execData = await getExec(submData.curr_eval.eval_uuid);
	if (!execData) return <>Error: execution data is empty.</>;

	const breadcrumbs = [
		{ label: "Iesūtījumi", href: "/submissions" },
		{ label: subm_id, href: `/submissions/${subm_id}` },
	];

	return (
		<Layout breadcrumbs={breadcrumbs} active="submissions">
			<div className="m-3 flex flex-col gap-3">
				<SubmInfoHeader
					possible={submData.curr_eval.score_info.possible}
					received={submData.curr_eval.score_info.received}
					language={submData.pr_lang.display}
					created_at={submData.created_at}
					task_name={submData.task_name}
					task_id={submData.task_id}
					username={submData.username}
					eval_status={submData.curr_eval.eval_stage}
				/>
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
				{(!execData.subm_comp || execData.subm_comp.exit === 0) && (
					<div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
						<TestResultTable
							visible_details={!!submData.content}
							subm_eval={submData.curr_eval}
							test_results={execData.test_res.map((x) => ({ ...x }))}
						/>
					</div>
				)}
				{execData.subm_comp && (
					<div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
						<p className="text-small text-default-900 select-none mb-1">Kompilācijas izvaddati:</p>
						<CodeBlock content={execData.subm_comp.out + execData.subm_comp.err || ""}/>
					</div>
				)}
			</div>
		</Layout>
	);
}
