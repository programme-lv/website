export const revalidate = 120; // 2 minutes

import Layout from "@/components/layout";
import { getTaskById } from "@/lib/task/tasks";

import TaskDetailsPage from "./task-page";
import { Toaster } from 'react-hot-toast';
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ task_id: string }>;
}): Promise<Metadata> {
  const { task_id } = await params;
  const response = await getTaskById(task_id);
  const task = response.data;

  return {
    title: task ? task.task_full_name : `Uzdevums ${task_id}`,
  };
}

export default async function TaskPageServerComponent({
  params,
}: {
  params: Promise<{ task_id: string }>;
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

      <div className="flex min-h-screen absolute pt-14 w-full left-0 md:pl-16 top-0 pointer-events-none overflow-hidden">
        {/* <div className="px-3 flex flex-grow"> */}
          <TaskDetailsPage task={task} />
        {/* </div> */}
      </div>
    </Layout>
  );
}
