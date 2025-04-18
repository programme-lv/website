export const dynamic = 'force-dynamic'
import { getTaskById } from "@/lib/task/tasks";
import TaskEditForm from "./TaskEditForm";
import { isAdmin } from "@/lib/dal";
import RestrictedPleaseLogin from "@/components/restricted-please-login";

export default async function TaskEditPage({ params }: { params: Promise<{ task_id: string }> }) {
  if (!(await isAdmin())) {
    return <RestrictedPleaseLogin />
  }

  const response = await getTaskById((await params).task_id);
  if (response.status != "success") {
    return <div>Error {response.code}: {response.message}</div>
  }
  const task = response.data;
  
  return <TaskEditForm task={task} />;
}
