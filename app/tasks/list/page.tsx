// export const dynamic = 'force-dynamic'
export const dynamic = 'force-dynamic'

import renderMD from "@/lib/renderMarkdown";
import ClientTasksList from "./components/ClientTasksList";
import queryPublishedTasksForTasksList from "./queries/query_pub_tasks_for_t_list";
import { graphql } from "@/gql";
import { getClient } from "@/lib/RSCApolloClient";
import { ListPublishedTasksForTasksListQuery } from "@/gql/graphql";
import { cookies } from "next/headers";

const whoamiGQL = graphql(`
query WhoamiTasksList {
    whoami {
        id
        username
        email
        firstName
        lastName
    }
}
`);

const ListSolvedPublishedTaskCodesByUsernameGQL = graphql(`
query ListSolvedPublishedTaskCodesByUsername($username: String!) {
    listSolvedPublishedTaskCodesByUsername(username: $username)
}
`);

type Task = ListPublishedTasksForTasksListQuery['listPublishedTasks'][number];
type TaskWithSolvedFlag = Task & { solved: boolean };

export default async function Tasks() {

	const _cookies = cookies()
	console.log(_cookies)

	let tasks = await queryPublishedTasksForTasksList() as TaskWithSolvedFlag[];
	tasks = filterTasksWithoutStableVersionDescription(tasks);
	tasks = tasks.sort(compareTasksByCreatedAtDate);
	tasks = renderTaskMarkdownStatements(tasks);

	try {
		const client = getClient();
		const { data } = await client.query({query: whoamiGQL});

		if (data.whoami) {
			const username = data.whoami.username;
			const { data: solvedTasksData } = await client.query({
				query: ListSolvedPublishedTaskCodesByUsernameGQL,
				variables: {
					username: username
				},
				context: {
					headers: {
						cookie: cookies().toString()
					}
				}
			});
			const solvedTaskCodes = solvedTasksData.listSolvedPublishedTaskCodesByUsername;
			tasks = tasks.map((task: TaskWithSolvedFlag) => {
				task.solved = solvedTaskCodes.includes(task.stable!.code);
				return task;
			});
		}
	} catch (e) {
		// user not logged in or other error
		tasks = tasks.map((task: TaskWithSolvedFlag) => {
			task.solved = false;
			return task;
		})
	}

	return (
		<ClientTasksList tasks={tasks} />
	);
}

function filterTasksWithoutStableVersionDescription(tasks: any) {
	tasks = tasks.filter((task: any) =>
		task.stable !== null && task.stable !== undefined);
	tasks = tasks.filter((t: any) =>
		t.stable!.description !== null && t.stable!.description !== undefined);
	return tasks;
}

function compareTasksByCreatedAtDate(a: any, b: any) {
	const aDate = new Date(a.createdAt);
	const bDate = new Date(b.createdAt);
	if (aDate < bDate) return 1;
	if (aDate > bDate) return -1;
	return 0;
}

function renderTaskMarkdownStatements(tasks: any) {
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
	return tasks;
}