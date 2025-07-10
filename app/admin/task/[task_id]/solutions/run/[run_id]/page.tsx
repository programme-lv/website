export const dynamic = 'force-dynamic'
import { isAdmin } from "@/lib/dal";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import Layout from "@/components/layout";
import { getTaskById } from "@/lib/task/tasks";
import ShikiCodeBlock from "@/components/ro-shiki-code";
import { DetailedSubmView } from "@/types/subm";
import { Execution } from "@/types/exec";
import CodeBlock from "@/components/code-block";
import TestResultTable from "@/components/test-result-table";

export default async function RunPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ task_id: string, run_id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!(await isAdmin())) {
    return <RestrictedPleaseLogin />
  }

  const { task_id, run_id } = await params;

  const response = await getTaskById(task_id);
  if (response.status != "success") {
    return <div>Error {response.code}: {response.message}</div>
  }

  const task = response.data;
  const { tab } = await searchParams;
  const currentTab = tab || "task";

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Uzdevumi"},
    { label: task.task_full_name, href: `/admin/task/${task.short_task_id}` },
    { label: "Risinājumi"},
    { label: "Izpilde"},
    { label: run_id.slice(0, 8), href: `/admin/task/${task.short_task_id}/solutions/run/${run_id}` },
  ];

  const submData: DetailedSubmView = {
    subm_uuid: run_id,
    content: "test",
    username: "test",
    curr_eval: {
      eval_uuid: run_id,
      subm_uuid: run_id,
      eval_stage: "pending",
      score_unit: "test",
      eval_error: "test",
      subtasks: [],
      test_groups: [],
      verdicts: [],
      score_info: {
        score_bar: {
          green: 0,
          red: 0,
          gray: 0,
          yellow: 0,
          purple: 0,
        },
        received: 0,
        possible: 0,
        max_cpu_ms: 0,
        max_mem_kib: 0,
        exceeded_cpu: false,
        exceeded_mem: false,
      },
    },
    pr_lang: {
      short_id: "test",
      display: "test",
      monaco_id: "test",
    },
    task_id: task_id,
    task_name: task.task_full_name,
    created_at: "test",
  };

  const execData: Execution = {
    uuid: run_id,
    stage: "finished",
    test_res: [],
    pr_lang: {
      short_id: "test",
      display: "test", 
      code_fname: "test",
      comp_cmd: "test",
      comp_fname: "test",
      exec_cmd: "test",
    },
    params: {
      cpu_ms: 1000,
      mem_kib: 262144,
      checker: null,
      interactor: null,
    },
    error_msg: null,
    sys_info: null,
    created_at: new Date().toISOString(),
    subm_comp: null

  };

  return (
    <Layout breadcrumbs={breadcrumbs} active="admin">
        <div className="m-3 flex flex-col gap-3">
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
            {execData.subm_comp && (
                <div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
                    <p className="text-small text-default-900 select-none mb-1">Kompilācijas izvaddati:</p>
                    <CodeBlock content={execData.subm_comp.out + execData.subm_comp.err || ""}/>
                </div>
            )}
            {(!execData.subm_comp || execData.subm_comp.exit === 0) && (
                <div className="bg-white p-3 rounded-sm border-small border-divider overflow-x-auto">
                    <TestResultTable
                        visible_details={!!submData.content}
                        subm_eval={submData.curr_eval}
                        test_results={execData.test_res.map((x) => ({ ...x }))}
                    />
                </div>
            )}
        </div>
    </Layout>
  )
}