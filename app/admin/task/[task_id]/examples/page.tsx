import { isAdmin } from "@/lib/dal";
import Layout from "@/components/layout";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import { getTaskById } from "@/lib/task/tasks";
import TaskAdminNav from "@/components/task-admin-nav";
import ExamplesEditForm from "./examples";

export default async function ExamplesPage({
    params,
}: {
    params: Promise<{ task_id: string }>;
}) {
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
        { label: "Uzdevumi" },
        { label: task.task_full_name, href: `/admin/task/${task.short_task_id}` },
        { label: "Piemēri" },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs} active="admin">
            <div className="flex gap-3 mr-3">
                <TaskAdminNav taskId={task.short_task_id} activeTab="examples" />
                <ExamplesEditForm/>
            </div>
        </Layout>
    )
}

