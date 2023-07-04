import { useQuery, gql, useMutation } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import { Button, Card, CardContent, Typography, CardActions, Table, TableCell, TableHead, TableRow, Paper } from '@mui/material'

const GET_TASK = gql`
query GetTask($id: ID!) {
    getTask(id: $id) {
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
    }[]
}

export default function EditTask() {
    const router = useRouter()
    const { loading, error, data } = useQuery(GET_TASK, { client: apolloClient, variables: { id: router.query["edit-task-id"] } })

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const task: Task = data.getTask

    function handleCreateNewVersion() {
        console.log('TODO: create new version')
    }


    return (
        <>
            <NavigationBar active='tasks' />
            <main className='container m-auto'>
                <TaskMetadata id={task.id} fullName={task.fullName} origin={task.origin} authors={task.authors} />
                <VersionTable versions={task.versions} />
            </main>
        </>
    )
}

const GET_TASK_SOURCES = gql`
query ListTaskSources {
    listTaskSources {
        abbreviation
        fullName
    }
}
`

type TaskSource = {
    abbreviation: string
    fullName: string
}

type TaskMetadataProps = {
    id: string
    fullName: string
    origin: string
    authors: string[]
}

const UPDATE_TASK_METADATA = gql`
mutation UpdateTask($id: ID!, $fullName: String, $origin: String, $authors: [String!]) {
    updateTask(id: $id, fullName: $fullName, origin: $origin, authors: $authors) {
        id
        fullName
        origin
        authors
    }
}
`

function TaskMetadata(props: TaskMetadataProps) {
    const { loading, error, data: taskSourceData } = useQuery(GET_TASK_SOURCES, { client: apolloClient })
    const [updateTaskMetadata] = useMutation(UPDATE_TASK_METADATA, { client: apolloClient })

    const [fullName, setFullName] = useState('')
    const [origin, setOrigin] = useState('')
    const [authors, setAuthors] = useState<string[]>([])
    const [taskSources, setTaskSources] = useState<TaskSource[]>([])

    useEffect(() => {
        setFullName(props.fullName)
        setOrigin(props.origin)
        setAuthors(props.authors)
    }, [props])

    useEffect(() => {
        if (taskSourceData) {
            setTaskSources(taskSourceData.listTaskSources)
        }
    }, [taskSourceData])

    async function handleUpdateTaskMetadata() {
        try {
            type UpdateTaskMetadataVariables = {
                id: string
                fullName: string
                origin?: string
                authors?: string[]
            }

            let data: UpdateTaskMetadataVariables = {
                id: props.id,
                fullName: fullName,
                origin: origin,
            }

            const response = await updateTaskMetadata({ variables: data })
            alert(JSON.stringify(response));
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            <div className="flex my-5 gap-5">
                <FirstMetadataPanel id={props.id} createdAt='todo' updatedAt='todo'/>
                <SecondMetadataPanel />
            </div>
            <div className="flex flex-col border border-gray-400 rounded p-5 my-5 max-w-md">

                <div className="my-2">
                    uzdevuma kods: <strong>{props.id}</strong>
                </div>

                <div className="flex flex-col gap-1 my-2">
                    <label htmlFor="full-task-name">pilnais nosaukums</label>
                    <input id="full-task-name" type="text" placeholder="pilnais nosaukums" value={fullName} onChange={(e) => { setFullName(e.target.value) }} className="p-2 border border-gray-400" />
                </div>

                <div className="flex flex-col gap-1 my-2">
                    <label htmlFor="task-origin">uzdevuma avots:</label>
                    <select id="task-origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="p-2">
                        <option value="">pašdarināts</option>
                        {taskSources.map(taskSource => (
                            <option key={taskSource.abbreviation} value={taskSource.abbreviation}>{taskSource.fullName}</option>
                        ))}
                    </select>
                </div>

                <Button onClick={handleUpdateTaskMetadata} variant='contained' color='primary'>saglabāt</Button>
            </div>
        </>
    )
}

type FirstMetadataPanelProps = {
    id: string
    createdAt: string
    updatedAt: string
};

function FirstMetadataPanel(props: FirstMetadataPanelProps) {
    return (
        <Card sx={{ minWidth: 275 }} variant='outlined'>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Uzdevuma izveides informācija
                </Typography>
                <Table>
                    <TableRow>
                        <TableCell className="pl-0">uzdevuma kods:</TableCell>
                        <TableCell><strong>{props.id}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="pl-0">izveidots:</TableCell>
                        <TableCell>{props.createdAt}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="pl-0">pēdējoreiz labots:</TableCell>
                        <TableCell>{props.updatedAt}</TableCell>
                    </TableRow>
                </Table>
            </CardContent>
            <CardActions className="flex justify-end">
                <Button size="small">Skatīt uzdevumu</Button>
                <Button size="small" color="error">Dzēst</Button>
            </CardActions>
        </Card>
    );
}

function SecondMetadataPanel() {
    return (
        <Card sx={{ minWidth: 275 }} variant='outlined'>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Avota informācija
                </Typography>
            </CardContent>
        </Card>
    )
}

type VersionTableProps = {
    versions: {
        id: string
        versionName: string
        timeLimitMs: number
        memoryLimitKb: number
        createdAt: string
        updatedAt: string
    }[]
}

function VersionTable(props: VersionTableProps) {
    const tableHeaders = [
        'versija',
        'laika ierobežojums [ms]',
        'atmiņas ierobežojums [kb]',
        'izveidots [laiks]',
        'labots [laiks]',
        'darbības',
    ]

    const headerClasses = ['border', 'text-black', 'text-center'].join(' ')

    return (
        <div className='flex flex-col border border-gray-400 rounded p-5 my-5'>
            <h1 className="text-xl font-semibold my-2">uzdevuma versijas</h1>
            <table className="min-w-full table">
                <thead className='text-cente'>
                    <tr>
                        {tableHeaders.map(header => (
                            <th key={header} className={headerClasses}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.versions.map(version => {
                        let rowElements = [
                            version.versionName,
                            version.timeLimitMs,
                            version.memoryLimitKb,
                            new Date(version.createdAt).toLocaleString(),
                            version.updatedAt,
                        ]
                        let elementClasses = ['border', 'text-black', 'text-center'].join(' ')
                        return (
                            <tr key={version.id}>
                                {rowElements.map(element => (
                                    <td key={element} className={elementClasses}>{element}</td>
                                ))}
                                <td className={elementClasses}>
                                    <div className="flex gap-6 justify-center p-2">
                                        <button className="p-2 bg-blue-600 text-white rounded">rediģēt</button>
                                        <button className="p-2 bg-red-400 rounded">dzēst</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
