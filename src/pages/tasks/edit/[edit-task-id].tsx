import NavBar from '@/components/NavBar'
import { useQuery, gql } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SecondaryButton from '@/components/SecondaryButton'

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
        <main className='p-5'>
            <NavBar />

            <TaskMetadata id={task.id} fullName={task.fullName} origin={task.origin} authors={task.authors} />
            <VersionTable versions={task.versions} />
        </main>
    )
}

type TaskMetadataProps = {
    id: string
    fullName: string
    origin: string
    authors: string[]
}

function TaskMetadata(props: TaskMetadataProps) {
    const [fullName, setFullName] = useState('')
    const [origin, setOrigin] = useState('')
    const [authors, setAuthors] = useState<string[]>([])

    useEffect(() => {
        setFullName(props.fullName)
        setOrigin(props.origin)
        setAuthors(props.authors)
    }, [props])

    return (

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
                    <option value="lio">Latvijas Informātikas olimpiāde</option>
                    <option value="ProblemCon">ProblemCon++</option>
                </select>
            </div>

            {/* <div className='my-2'>
                autori: <span className="text-blue-600 font-bold">{props.authors.join(', ')}</span>
            </div> */}
            <SecondaryButton text="saglabāt izmaiņas" />
        </div>
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