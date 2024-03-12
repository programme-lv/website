'use server';

import queryGetCurrentTaskVersionByCode from "./queries/queryGetCurrentTaskVersion";
import ClientQuery from "./components/ClientQuery";
// const Task = {
//     name: "Baobabs",
//     code: "bao",
//     author: "Krishjanis Petruchena",
//     created_at: "12.12.2022 12:12",
//     modified_at: "01.09.2023 02:29",
//     version: "3.14"
// };

export default async function GeneralInfo(props:any){
    let taskVersion = await queryGetCurrentTaskVersionByCode(props.params.code);
    let dateUpdatedAt = (new Date(taskVersion.updatedAt)).toLocaleString();
    let dateCreatedAt = (new Date(taskVersion.createdAt)).toLocaleString();
    

    return (
        <ClientQuery taskVersion={taskVersion} dateUpdatedAt={dateUpdatedAt} dateCreatedAt={dateCreatedAt}/>
    );
}