export const revalidate = 60 * 2; // 2 minutes

import Layout from "@/components/layout";
import { getTaskById } from "@/lib/tasks";

import TaskDetailsPage from "./task-page";

export default async function TaskPageServerComponent({
  params,
}: {
  params: { task_id: string };
}) {
  const response = await getTaskById(params.task_id);
  const task = response.data;

  if (!task) {
    return <div>{JSON.stringify(response)}</div>;
  }

  const breadcrumbs = [
    { label: "Uzdevumi", href: "/tasks" },
    { label: task.task_full_name, href: `/tasks/${params.task_id}` },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <TaskDetailsPage task={task} />
    </Layout>
  );
}
