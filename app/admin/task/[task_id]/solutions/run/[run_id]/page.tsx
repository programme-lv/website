export const dynamic = 'force-dynamic'
import { isAdmin } from "@/lib/dal";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import Layout from "@/components/layout";
import { TextLink } from "@/components/text-link";
import { getTaskById } from "@/lib/task/tasks";

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
    { label: "Atrisinājumi"},
    { label: "Izpilde"},
    { label: run_id.slice(0, 8), href: `/admin/task/${task.short_task_id}/solutions/run/${run_id}` },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} active="admin">
        <div className="m-3">

        </div>
    </Layout>
  )
}