'use server';

import queryGeneralInfo from "./queries/queryGeneralInfo";
import ClientQuery from "./components/ClientQuery";

export default async function GeneralInfo(props:any){
    let taskVersion = await queryGeneralInfo(props.params.code);
    let dateUpdatedAt = (new Date(taskVersion.updatedAt)).toLocaleString();
    let dateCreatedAt = (new Date(taskVersion.createdAt)).toLocaleString();
    

    return (
        <ClientQuery taskVersion={taskVersion} dateUpdatedAt={dateUpdatedAt} dateCreatedAt={dateCreatedAt}/>
    );
}