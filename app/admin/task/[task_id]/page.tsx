export const dynamic = 'force-dynamic'
import { getTaskById } from "@/lib/task/tasks";
import TaskEditForm from "./TaskEditForm";
import { isAdmin } from "@/lib/dal";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import Layout from "@/components/layout";
import { Button } from "@heroui/button";
import { TextLink } from "@/components/text-link";

export default async function TaskEditPage({ params }: { params: Promise<{ task_id: string }> }) {
  if (!(await isAdmin())) {
    return <RestrictedPleaseLogin />
  }

  const response = await getTaskById((await params).task_id);
  if (response.status != "success") {
    return <div>Error {response.code}: {response.message}</div>
  }
  const task = response.data;

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Uzdevumi"},
    { label: task.task_full_name},
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} active="admin">
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-2 m-2 p-4 bg-white border border-divider">
            <nav className="flex flex-col gap-2">
              Rediģējamās sadaļas
              <TextLink href={`/admin/task/${task.short_task_id}?tab=task`}>Uzdevums</TextLink>
              <TextLink href={`/admin/task/${task.short_task_id}?tab=statement`}>Formulējums</TextLink>
            </nav>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <TaskEditForm task={task} />
        </div>
      </div>
    </Layout>
  )
}