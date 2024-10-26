export const revalidate = 60 * 2; // 2 minutes

import Layout from "@/components/layout";
import { getTaskById } from "@/lib/tasks";

import TaskDetailsPage from "./task-page";
import { Toaster } from 'react-hot-toast';

export default async function TaskPageServerComponent({
  params,
}: {
  params: { task_id: string };
}) {
  const {task_id} = await params;

  const response = await getTaskById(task_id);
  const task = response.data;

  if (!task) {
    return <div>{JSON.stringify(response)}</div>;
  }

  const breadcrumbs = [
    { label: "Uzdevumi", href: "/tasks" },
    { label: task.task_full_name, href: `/tasks/${task_id}` },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} active="tasks">
      <Toaster/>
      <TaskDetailsPage task={task} />
    </Layout>
  );
}
