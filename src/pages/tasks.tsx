import { gql, useQuery, useMutation } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import { Button } from '@mui/material'
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Task from '@/types/task'
import CreateTaskDialog from '@/components/CreateTaskModal'

export default function Tasks() {
    const [createTaskOpen, setCreateTaskOpen] = useState<boolean>(false)

    return (
        <>
            <CreateTaskDialog open={createTaskOpen} handleClose={()=>setCreateTaskOpen(false)}/>
            <NavigationBar active='tasks' />
            <main className="container m-auto">
                <div className="w-full">
                    <TaskTable />
                </div>
                <Button variant='contained' onClick={() => setCreateTaskOpen(true)}>Izveidot</Button>
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

function TaskTable() {
    const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })
    const [tasks, setTasks] = useState<Task[]>([])
    useEffect(() => { if (data) setTasks(data.listTasks) }, [data])


    if (loading) return <p>ielādē uzdevumus</p>
    if (error) return <p>kļūda: {error.message}</p>


    return (
        <Card variant='outlined' className='my-5'>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> uzdevuma kods </TableCell>
                            <TableCell>pilnais nosaukums</TableCell>
                            <TableCell>avots</TableCell>
                            <TableCell>autori</TableCell>
                            <TableCell align='center'>darbības</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task: Task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.fullName}</TableCell>
                                <TableCell>{task.origin}</TableCell>
                                <TableCell>{(task.authors).join(" ")}</TableCell>
                                <TableCell className="w-0"><TaskActions taskID={task.id} /></TableCell>
                            </TableRow>))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
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
        if (confirm(`Vai tiešām vēlaties dzēst uzdevumu ar kodu "${taskID}"?`)) {
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
        <div className="flex gap-3 justify-start items-center ">
            <Link href={`/tasks/${props.taskID}`}>
                <Button variant='contained' color='primary' size='small'>skatīt</Button>
            </Link>
            <Link href={`/tasks/edit/${props.taskID}`}>
                <Button variant='contained' color='secondary' size='small'>rediģēt</Button>
            </Link>
            <div>
                <Button onClick={() => handleDeleteTask(props.taskID)} variant='contained' color='error' size='small'>
                    dzēst</Button>
            </div>
        </div>
    )
}
