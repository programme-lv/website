import { gql, useQuery, useMutation } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import { Button } from '@mui/material'
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Tasks() {
    return (
        <>
            <NavigationBar active='tasks' />
            <main>
                <TaskTable />
            </main>
        </>
    )
}


export const GET_TASKS = gql`
query ListTasks {
    listTasks {
        id
        fullName
        origin
        authors
        versions {
            id
            versionName
            timeLimitMs
            memoryLimitKb
            createdAt
            updatedAt
            evalType {
                id
                descriptionEn
            }
        }
    }
}
`

type Task = {
    id: string
    fullName: string
    origin: string
    authors: string[]
    versions: {
        id: string
        versionName: string
        timeLimitMs: number
        memoryLimitKb: number
        createdAt: string
        updatedAt: string
        evalType: {
            id: string
            descriptionEn: string
        }
    }[]
}

function TaskTable() {
    const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })
    const [tasks, setTasks] = useState<Task[]>([])
    useEffect(() => { if (data) setTasks(data.listTasks)}, [data])


    if (loading) return <p>ielādē uzdevumus</p>
    if (error) return <p>kļūda: {error.message}</p>


    return (
        <div className="flex flex-col border border-gray-400 rounded p-5 my-5">
            <table className="min-w-full border-collapse text-sm table-fixed w-full">
                <thead>
                    <tr>
                        <TaskTableTh>kods</TaskTableTh>
                        <TaskTableTh>pilnais nosaukums</TaskTableTh>
                        <TaskTableTh>avots</TaskTableTh>
                        <TaskTableTh>autori</TaskTableTh>
                        <th className="px-6 py-3 text-center border border-solid w-[600px]">darbības</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task: any) => (
                        <tr key={task.id}>
                            <TaskTableTd>{task.id}</TaskTableTd>
                            <TaskTableTd>{task.fullName}</TaskTableTd>
                            <TaskTableTd>{task.origin}</TaskTableTd>
                            <TaskTableTd>{(task.authors as string[]).join(" ")}</TaskTableTd>
                            <TaskTableTd><TaskActions taskID={task.id} /></TaskTableTd>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Card variant='outlined' className='my-5'>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> uzdevuma kods </TableCell>
                                <TableCell>pilnais nosaukums</TableCell>
                                <TableCell>avots</TableCell>
                                <TableCell>autori</TableCell>
                                <TableCell>darbības</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task:Task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.fullName}</TableCell>
                                <TableCell>{task.origin}</TableCell>
                                <TableCell>{(task.authors).join(" ")}</TableCell>
                                <TableCell><TaskActions taskID={task.id}/></TableCell>
                            </TableRow>))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </div>
    )
}

type TaskActionsProps = {
    taskID: string
}

const DELETE_TASK = gql`
mutation DeleteTask ($id: ID!) {
	deleteTask(id: $id)
}
`

// view as user, edit as admin, delete as admin
function TaskActions(props: TaskActionsProps) {
    const [deleteTask] = useMutation(DELETE_TASK, { client: apolloClient })

    async function handleDeleteTask(taskID: string) {
        if (confirm("Vai tiešām vēlaties dzēst šo uzdevumu?")) {
            try {
                await deleteTask({ variables: { id: taskID } })
                window.location.reload()
            } catch (e: any) {
                if (e.message)
                    alert(e.message)
                else
                    alert("nezināma kļūda")
            }
        }
    }
    return (
        <div className="flex gap-3 justify-center items-center ">
            <Link href={`/tasks/${props.taskID}`}>
                <Button variant='contained' color='primary'>skatīt</Button>
            </Link>
            <Link href={`/tasks/edit/${props.taskID}`}>
                <Button variant='contained' color='secondary'>rediģēt</Button>
            </Link>
            <div>
                <Button onClick={()=>handleDeleteTask(props.taskID)} variant='contained' color='error'>dzēst</Button>
            </div>
        </div>
    )
}

const TaskTableTh = (props: { children: any }) => (
    <th scope="col" className="px-6 py-3 text-center border border-solid">
        {props.children}
    </th>
)

const TaskTableTd = (props: { children: any }) => (
    <td className="px-6 py-4  border border-solid">
        <div className="text-sm text-gray-900">{props.children}</div>
    </td>
)
