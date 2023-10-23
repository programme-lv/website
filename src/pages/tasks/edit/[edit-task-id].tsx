import NavigationBar from '@/components/NavigationBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Textarea from '@mui/joy/Textarea';
import JoyButton from '@mui/joy/Button';
import {gql, useQuery} from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import Task from '@/types/task';

const GET_RELEVANT_TASK_BY_ID = gql`
    
`



type View = 'description' | 'testing' | 'metadata'

export default function EditTask() {
    const router = useRouter()
    const taskId = router.query['edit-task-id'] as string

    const {loading, error, data} = useQuery(GET_RELEVANT_TASK_BY_ID, {
        variables: {id: taskId},
        client: apolloClient
    })

    const [task, setTask] = useState<Task|null>(null)
    useEffect(()=>{
        if(data)
            setTask(data.getRelevantTaskById);
    }, [data]);

    const [openedView, setOpenedView] =
        useState<View>('description');

    if(error) return <p>Error: {error.message}</p>
    if(loading||!task) return <p>Loading...</p>

    return (
        <>
            <NavigationBar active='tasks' />
            <main className="container m-auto">
                <div className="flex justify-between gap-12 mt-12">
                    <div className="flex-grow max-w-[15em]">
                        <ActionList openedView={openedView} setOpenedView={setOpenedView} />
                    </div>
                    <div className="flex-grow">
                        <TaskEditView task={task as Task} view={openedView} />
                    </div>
                </div>
            </main>
        </>
    )
}

function ActionList(props: { openedView: View, setOpenedView: (view: View) => void }) {
    return (
        <nav className="flex flex-col gap-2 border-0 border-r border-solid border-gray-200 p-2">
            <ActionListButton
                isActive={props.openedView === 'description'}
                onClick={() => props.setOpenedView('description')}>
                Apraksts
            </ActionListButton>
            <ActionListButton
                isActive={props.openedView === 'testing'}
                onClick={() => props.setOpenedView('testing')}>
                Testēšana
            </ActionListButton>
            <ActionListButton
                isActive={props.openedView === 'metadata'}
                onClick={() => props.setOpenedView('metadata')}>
                Metadati
            </ActionListButton>
        </nav>
    )
}

function ActionListButton(props: { isActive: boolean, onClick: () => void, children: any }) {

    if (props.isActive) return (
        <div className="flex items-center w-full">
            <span className="font-extrabold text-blue-69 text-xl">|</span>
            <button type='button'
                className="bg-transparent border-none bg-gray-69 hover:bg-gray-69 p-2 text-left text-md w-full">
                <span className="font-semibold">{props.children}</span>
            </button>
        </div>
    )
    else return (
        <button type='button'
            className="bg-transparent border-none cursor-pointer hover:bg-gray-69 rounded-lg p-2 text-left text-md"
            onClick={props.onClick}>
            {props.children}
        </button >
    )
}

type TaskEditViewProps = {
    task: Task,
    view: View
}

function TaskEditView(props: TaskEditViewProps) {
    switch (props.view) {
        case 'description':
            return <DescriptionView task={props.task}/>
        case 'testing':
            return <TestingView />
        case 'metadata':
            return <MetadataView />
    }
}

/*
 * apraksts
 * testēšana
 * metadati
 * publicēšana
*/

function DescriptionView(props: {task: Task}){
    return (<>
        <h2 className="m-0 font-light border-0 border-b border-b-gray-420 border-solid pb-2 mb-6">
            Uzdevuma Apraksts</h2>
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label>Nosaukums</label>
                <Textarea value={props.task.name}/>
            </div>
            <div className="flex flex-col gap-1">
                <label>Stāsts / uzdevuma izklāsts</label>
                <Textarea minRows={5} />
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-grow">
                    <label>Ievaddatu apraksts</label>
                    <Textarea minRows={5} />
                </div>
                <div className="flex flex-col gap-1 flex-grow">
                    <label>Izvaddatu apraksts</label>
                    <Textarea minRows={5} />
                </div>
            </div>
            <div className="flex justify-end">
                <JoyButton color='success'>Saglabāt</JoyButton>
            </div>
        </div>
    </>)
}

function TestingView() {
    return (<>testing</>)
}

function MetadataView() {
    return (<>metadata</>)
}



