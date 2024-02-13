export const dynamic = 'force-dynamic'
export const revalidate = 60

import renderMD from "@/lib/render";
import ClientTasks from "./components/ClientTasks";
import queryPublishedTasks from "@/graphql/requests/queryPublishedTask";

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