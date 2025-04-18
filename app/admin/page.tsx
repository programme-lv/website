export const dynamic = 'force-dynamic'

import { isAdmin } from "@/lib/dal";
import { listTasks } from "@/lib/task/tasks";
import Link from "next/link";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import GenericTable from "@/components/generic-table";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <RestrictedPleaseLogin />
  }

  const tasks = await listTasks();

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold mb-4">Administrācijas panelis</h1>
      <h2 className="text-xl font-semibold mb-4">Uzdevumu saraksts</h2>
      <div className="p-2 bg-white  max-w-2xl">
        <GenericTable
          data={tasks.data || []}
          columns={[
            {
              key: "id",
              header: "Uzdevuma ID",
              render: (task) => task.published_task_id
            },
            {
              key: "name",
              header: "Pilnais nosaukums",
              render: (task) => task.task_full_name
            },
            {
              key: "action",
              header: "Darbība",
              render: (task) => (
                <Link href={`/admin/task/${task.published_task_id}`}>
                  <button className="bg-blue-500 text-sm text-white p-2 rounded">
                    Rediģēt
                  </button>
                </Link>
              ),
            }
          ]}
          keyExtractor={(task) => task.published_task_id}
          className="w-full"
        />
      </div>
    </div>
  );
}
