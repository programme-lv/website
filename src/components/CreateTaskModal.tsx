import { gql,useMutation } from "@apollo/client"
import apolloClient from '@/lib/apolloClient';
import { useState } from "react";
import { Modal } from "@mui/material";

const CREATE_TASK = gql`
mutation CreateTask($id: String!, $fullName: String!){
    createTask(id: $id, fullName: $fullName) {
        id
        fullName
        origin
        authors
    }
}
`

type CreateTaskModalProps = {
    open: boolean;
    handleClose: ()=>void;
}

// redirects to created task after success
export default function CreateTaskModal(props: CreateTaskModalProps) {
    const [createTask] = useMutation(CREATE_TASK, { client: apolloClient })

    const [newTaskId, setNewTaskId] = useState<string>("")
    const [newTaskFullName, setNewTaskFullName] = useState<string>("")

    async function handleCreateTask() {
        try {
            let response = await createTask({ variables: { id: newTaskId, fullName: newTaskFullName } })
            if (response.data.createTask) {
                console.log(response.data.createTask);
            }
        } catch (e: any) {
            if (e.message)
                alert(e.message)
            else
                alert("nezināma kļūda")
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}

        >
<>1234</>
        </Modal>
    )
}

/*
   <Modal isOpen={isCreateTaskModalOpen} closeModal={handleCloseCreateTaskModal} continueText="Izveidot uzdevumu!" continueCallback={handleCreateTask} title='Jauna uzdevuma izveide!'>
   <div className="flex flex-col gap-3">
   <label>uzdevuma kods (id):</label>
   <input type="text" className="border border-gray-400 rounded p-2"
   onChange={(e) => setNewTaskId(e.target.value)} />
   </div>
   <div className='flex flex-col gap-3 mt-4'>
   <label>pilnais nosaukums:</label>
   <input type="text" className="border border-gray-400 rounded p-2"
   onChange={(e) => setNewTaskFullName(e.target.value)} />
   </div>
   </Modal>
*/
