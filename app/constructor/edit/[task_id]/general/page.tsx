'use server';

import queryGeneralInfo from "./queries/queryGeneralInfo";
import ClientGeneralView from "./components/ClientView";

export default async function GeneralInfo(props:any){
    let task = await queryGeneralInfo(props.params.task_id);
    if(!task) return (<p>Task not found</p>);
    return (
        <ClientGeneralView task={task}/>
    );
}