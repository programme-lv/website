"use server";

import renderMD from "@/lib/render";
import ClientTasks from "./components/ClientTasks";
import queryPublishedTasks from "./queries/queryPublishedTask";

export default async function Tasks() {
	let tasks = await queryPublishedTasks();
	return (
		<ClientTasks tasks={tasks.map(task=>{
			return {
				code: task.code,
				name: task.name,
				shortDesc: renderMD(task.description.story)
			}
		})}/>
  	);
}