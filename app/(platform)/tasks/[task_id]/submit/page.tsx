export const revalidate = 120;

import Layout from "@/components/layout";
import { getTaskById } from "@/lib/task/tasks";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

import TaskEditor from "../task-editor";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ task_id: string }>;
}): Promise<Metadata> {
	const { task_id } = await params;
	const response = await getTaskById(task_id);
	const task = response.data;

	return {
		title: task ? `Iesūtīt: ${task.task_full_name}` : `Iesūtīt ${task_id}`,
	};
}

export default async function TaskSubmitPage({
	params,
}: {
	params: Promise<{ task_id: string }>;
}) {
	const { task_id } = await params;
	const response = await getTaskById(task_id);
	const task = response.data;

	if (!task) {
		return <div>{JSON.stringify(response)}</div>;
	}

	return (
		<Layout wide active="tasks">
			<Toaster />
			<TaskEditor
				backHref={`/tasks/${task.short_task_id}`}
				taskCode={task.short_task_id}
			/>
		</Layout>
	);
}
