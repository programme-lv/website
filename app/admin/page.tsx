export const dynamic = 'force-dynamic'

import { isAdmin } from "@/lib/dal";
import { listTasks } from "@/lib/task/tasks";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import TaskAdminList from "./task-admin-list";
import SubmAdminList from "./subm-admin-list";
import { listSubmissions } from "@/lib/subms";
import Layout from "@/components/layout";

export default async function AdminPage() {
    if (!(await isAdmin())) {
        return <RestrictedPleaseLogin />
    }

    const tasks = await listTasks();
    const submPage = await listSubmissions(0, 10);

    const breadcrumbs = [
        { label: "Admin", href: "/admin" },
      ];
      
    return (
        <Layout breadcrumbs={breadcrumbs} active="admin">
            <div className="container mx-auto py-2">
                <h2 className="text-xl font-semibold mb-4">Iesūtījumu saraksts</h2>
                <SubmAdminList submPage={submPage} />
                <br/>
                <h2 className="text-xl font-semibold mb-4">Uzdevumu saraksts</h2>
                <TaskAdminList tasks={tasks} />
            </div>
        </Layout>
    );
}
