import NavBar from '@/components/NavBar'
import { useQuery, gql } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

    const [fullName, setFullName] = useState('')
    const [origin, setOrigin] = useState('')

    useEffect(() => {
        if (data) {
            setFullName(data.getTask.fullName)
            setOrigin(data.getTask.origin)
        }
    }, [data])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const task: Task = data.getTask

    function handleCreateNewVersion() {
        console.log('TODO: create new version')
    }


    return (
        <main className='p-5'>
            <NavBar />
            <h1>edit/[id].tsx</h1>

            <div className="max-w-sm border p-5 flex flex-col">
                <div className="my-2">
                    uzdevuma kods: <strong>{task.id}</strong>
                </div>
                <div className="flex flex-col gap-1 my-2">
                    <label htmlFor="full-task-name">pilnais nosaukums</label>
                    <input id="full-task-name" type="text" placeholder="pilnais nosaukums" value={fullName} onChange={(e) => { setFullName(e.target.value) }} className="input input-sm input-bordered input-primary focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1 my-2">
                    <label htmlFor="task-origin">avots</label>
                    <select id="task-origin" value={origin} onChange={(e)=>setOrigin(e.target.value)}  className="select select-sm select-bordered select-primary focus:outline-none">
                        <option value="lio">Latvijas Informātikas olimpiāde</option>
                        <option value="ProblemCon">ProblemCon++</option>
                    </select>
                </div>
                <button className="mt-5 btn btn-success btn-sm lowercase">saglabāt izmaiņas</button>
            </div>

            <p>authors: {task.authors.join(', ')}</p>
            <p>versions: {task.versions.map(version => version.versionName).join(', ')}</p>

            <button onClick={handleCreateNewVersion}>izveidot jaunu versiju</button>

            <VersionTable versions={task.versions} />
        </main>
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
        'izveidots',
        'labots',
        'darbības',
    ]

    const headerClasses = ['border', 'text-black', 'text-center'].join(' ')

    return (
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
                        version.createdAt,
                        version.updatedAt,
                    ]
                    let elementClasses = ['border', 'text-black', 'text-center'].join(' ')
                    return (
                        <tr key={version.id}>
                            {rowElements.map(element => (
                                <td key={element} className={elementClasses}>{element}</td>
                            ))}
                            <td className="flex justify-center gap-3">
                                <button className="btn btn-sm lowercase btn-primary">rediģēt</button>
                                <button className="btn btn-sm lowercase btn-error">dzēst</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
