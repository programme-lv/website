export const dynamic = 'force-dynamic'
export const revalidate = 60

import renderMD from "@/lib/renderMarkdown";
import ClientTasksList from "./components/ClientTasksList";
import queryPublishedTasksForTasksList from "./queries/query_pub_tasks_for_t_list";

export default async function Tasks() {
	let tasks = await queryPublishedTasksForTasksList();
	tasks = tasks.filter((task) =>
		task.stable !== null && task.stable !== undefined);
	tasks = tasks.filter((t) =>
		t.stable!.description !== null && t.stable!.description !== undefined);
	tasks = tasks.sort((a, b) => {
		const aDate = new Date(a.createdAt);
		const bDate = new Date(b.createdAt);
		if (aDate < bDate) return 1;
		if (aDate > bDate) return -1;
		return 0;
	});

	for (let i = 0; i < tasks.length; i++) {
		tasks[i] = JSON.parse(JSON.stringify(tasks[i]));
		if (!tasks[i].stable!.description) continue;

		tasks[i].stable!.description!.story =
			renderMD(tasks[i].stable!.description!.story);
		tasks[i].stable!.description!.input =
			renderMD(tasks[i].stable!.description!.input);
		tasks[i].stable!.description!.output =
			renderMD(tasks[i].stable!.description!.output);

		if (tasks[i].stable!.description!.notes)
			tasks[i].stable!.description!.notes =
				renderMD(tasks[i].stable!.description!.notes!);
	}

	return (
		<ClientTasksList tasks={tasks} />
	);
}