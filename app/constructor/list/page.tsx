'use server';

import queryListEditableTasks from "./queries/queryListEditableTasks";
import ClientList from "./components/ClientList";

export default async function List() {
    let tasks = await queryListEditableTasks();
    let datesUpdatedAt = [];
    for (var i = 0; i < tasks.length; i++) {
        datesUpdatedAt.push((new Date(tasks[i]['updatedAt'])).toLocaleString()); 
    }
    return (
        <ClientList tasks={tasks} datesUpdatedAt={datesUpdatedAt} />
    );
}
