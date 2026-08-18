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

  return (
    <Layout wide active="tasks">
      <Toaster/>
      <TaskDetailsPage task={task} />
    </Layout>
  );
}
