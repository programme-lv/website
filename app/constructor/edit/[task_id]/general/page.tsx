'use server';

import queryGeneralInfo from './queries/queryGeneralInfo';
import ClientGeneralView from './components/ClientView';
import ProglvShell from '@/components/ProglvShell/ProglvShell';

export default async function GeneralInfo(props: any) {
    let task = await queryGeneralInfo(props.params.task_id);
    if (!task) return <p>Task not found</p>;

    return (
        <ProglvShell
            pageID="general_info"
            breadcrumbs={[
                { title: 'Uzdevumu  konstruktors', href: '/constructor/main' },
                { title: 'Mani uzdevumi', href: '/constructor/list' },
                { title: task.current.name, href: `/constructor/edit/${task.taskID}/general` },
            ]}
            task_id={task.taskID}
            navbarID="constructor"
        >
            <ClientGeneralView task={task} />
        </ProglvShell>
    );
}
