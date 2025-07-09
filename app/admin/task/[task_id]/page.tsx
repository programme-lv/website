export const dynamic = 'force-dynamic'
import { getTaskById } from "@/lib/task/tasks";
import StatementEditForm from "./statement";
import TaskEditForm from "./task";
import { isAdmin } from "@/lib/dal";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import Layout from "@/components/layout";
import { TextLink } from "@/components/text-link";
import SolutionsEditForm from "./solutions";

export default async function TaskEditPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ task_id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!(await isAdmin())) {
    return <RestrictedPleaseLogin />
  }

  const response = await getTaskById((await params).task_id);
  if (response.status != "success") {
    return <div>Error {response.code}: {response.message}</div>
  }
  const task = response.data;
  const { tab } = await searchParams;
  const currentTab = tab || "task";

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Uzdevumi"},
    { label: task.task_full_name},
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} active="admin">
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-3 m-3 p-4 bg-white border border-divider">
            <nav className="flex flex-col gap-2">
              <div className="font-medium mb-2">Rediģējamās sadaļas</div>
              <div className={currentTab === "task" ? "font-semibold" : ""}>
                <TextLink href={`/admin/task/${task.short_task_id}?tab=task`}>
                  Uzdevums
                </TextLink>
              </div>
              <div className={currentTab === "statement" ? "font-semibold" : ""}>
                <TextLink href={`/admin/task/${task.short_task_id}?tab=statement`}>
                  Formulējums
                </TextLink>
              </div>
              <div className={currentTab === "testing" ? "font-semibold" : ""}>
                <TextLink disabled href={`/admin/task/${task.short_task_id}?tab=testing`}>
                  Testēšana
                </TextLink>
              </div>
              <div className={currentTab === "solutions" ? "font-semibold" : ""}>
                <TextLink href={`/admin/task/${task.short_task_id}?tab=solutions`}>
                  Atrisinājumi
                </TextLink>
              </div>
              <div className={currentTab === "archive" ? "font-semibold" : ""}>
                <TextLink disabled href={`/admin/task/${task.short_task_id}?tab=archive`}>
                  Arhīvs
                </TextLink>
              </div>
              <div className={currentTab === "history" ? "font-semibold" : ""}>
                <TextLink disabled href={`/admin/task/${task.short_task_id}?tab=history`}>
                  Vēsture
                </TextLink>
              </div>
            </nav>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {currentTab === "statement" ? (
            <StatementEditForm task={task} />
          ) : currentTab === "solutions" ? (
            <SolutionsEditForm task_id={task.short_task_id}/>
          ) : (
            <TaskEditForm task={task} />
          )}
        </div>
      </div>
    </Layout>
  )
}