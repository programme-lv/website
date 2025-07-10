export const dynamic = 'force-dynamic'
import { getTaskById } from "@/lib/task/tasks";
import StatementEditForm from "./statement/statement";
import TaskEditForm from "./task";
import { isAdmin } from "@/lib/dal";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import Layout from "@/components/layout";
import TaskAdminNav from "@/components/task-admin-nav";

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
        <TaskAdminNav taskId={task.short_task_id} activeTab="task" />
        <div className="flex-1 min-w-0">
          {currentTab === "statement" ? (
            <StatementEditForm task={task} />
          ) : (
            <TaskEditForm task={task} />
          )}
        </div>
      </div>
    </Layout>
  )
}