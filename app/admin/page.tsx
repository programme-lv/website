export const dynamic = 'force-dynamic'

import { isAdmin } from "@/lib/dal";
import { listTasks } from "@/lib/task/tasks";
import Link from "next/link";
import RestrictedPleaseLogin from "@/components/restricted-please-login";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <RestrictedPleaseLogin />
  }

  const tasks = await listTasks();

  return (
      <div className="px-3">
        <h1 className="text-2xl font-bold mb-4">Administrācijas panelis</h1>
        <h2 className="text-xl font-semibold mb-4">Uzdevumu saraksts</h2>
        <table className="border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Nosaukums</th>
              <th className="border px-4 py-2 text-left">Darbība</th>
            </tr>
          </thead>
          <tbody>
            {tasks.data?.map((task, index) => (
              <tr 
                key={task.published_task_id} 
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="border px-4 py-2">{task.published_task_id}</td>
                <td className="border px-4 py-2">{task.task_full_name}</td>
                <td className="border px-4 py-2">
                  <Link href={`/admin/task/${task.published_task_id}`}>
                    <button className="bg-blue-500 text-small text-white px-4 py-2 rounded">
                      Rediģēt
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}
