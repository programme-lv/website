'use server';

import ProglvShell from "@/components/ProglvShell/ProglvShell";
import queryGeneralInfo from "../general/queries/queryGeneralInfo";
import ClientComponent from "./components/ClientComponent";

export default async function Statement(props: any) {
    let task = await queryGeneralInfo(props.params.task_id);
    if (!task) return <p>Task not found</p>;

    return (
        <ProglvShell
            activePage="general_info"
            breadcrumbs={[
                { title: 'Uzdevumu  konstruktors', href: '/constructor/list' },
                { title: 'Mani uzdevumi', href: '/constructor/list' },
                { title: task.current.name, href: `/constructor/edit/${task.taskID}/general` },
            ]}
            task_id={task.taskID}
            navbarType="constructor"
        >
            <ClientComponent task={task} />
        </ProglvShell>
    );
}
