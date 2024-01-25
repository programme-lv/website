"use server";

import ClientTasks from "./components/ClientTasks";
import queryPublishedTasks from "./queries/queryPublishedTask";

export default async function Tasks() {
	const tasks = await queryPublishedTasks();
	return (
		<ClientTasks tasks={tasks.map(task=>{
			return {
				code: task.code,
				name: task.name,
				shortDesc: task.description.story
			}
		})}/>
  	);
}