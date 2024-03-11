'use server';

import queryListEditableTasks from "./queries/queryListEditableTasks";
import ClientList from "./components/ClientList";

export default async function List() {
    let tasks = await queryListEditableTasks();

    return (
        <ClientList tasks={tasks} />
    );
}
