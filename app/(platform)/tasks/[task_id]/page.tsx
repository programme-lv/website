export const revalidate = 60 * 2; // 2 minutes

import React from "react";

import TaskDetailsPage from "./task-page";
import Layout from "@/components/layout";

export default async function TaskPageServerComponent({
  params,
}: {
  params: { task_id: string };
}) {
  const breadcrumbs = [
    { label: "Uzdevumi", href: "/tasks" },
    { label: params.task_id, href: `/tasks/${params.task_id}` },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <TaskDetailsPage task={null} />;
    </Layout>
  );
}
