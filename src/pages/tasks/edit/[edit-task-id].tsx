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
        memoryLimitMb: number
        createdAt: string
        updatedAt: string
    }[]
}

export default function EditTask() {
    const router = useRouter()
    const { loading, error, data } = useQuery(GET_TASK, { client: apolloClient, variables: { id: router.query["edit-task-id"] } })

    const [fullName, setFullName] = useState('')

    useEffect(() => {
        if (data) {
            setFullName(data.getTask.fullName)
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

            <fieldset className="p-5">
                <legend>uzdevuma dati</legend>
                <p>id: {task.id}</p>
                <TextInputField label="pilnais nosaukums" value={fullName} onChange={setFullName} />
                <button className="mt-5">saglabāt</button>
            </fieldset>

            <p>origin: {task.origin}</p>
            <p>authors: {task.authors.join(', ')}</p>
            <p>versions: {task.versions.map(version => version.versionName).join(', ')}</p>

            <button onClick={handleCreateNewVersion}>izveidot jaunu versiju</button>

            <VersionTable versions={task.versions} />
        </main>
    )
}

type TextInputFieldProps = {
    label: string
    value: string
    onChange: (value: string) => void
}

function TextInputField(props: TextInputFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label>{props.label}:</label>
            <input
                type="text"
                className="px-4 py-2"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    )
}

type VersionTableProps = {
    versions: {
        id: string
        versionName: string
        timeLimitMs: number
        memoryLimitMb: number
        createdAt: string
        updatedAt: string
    }[]
}

function VersionTable(props: VersionTableProps) {
    return (
        <table className="min-w-full border-collapse text-sm">
            <thead>
                <tr>
                    <VersionTableTh>versija</VersionTableTh>
                    <VersionTableTh>laika ierobežojums [ms]</VersionTableTh>
                    <VersionTableTh>atmiņas ierobežojums [kb]</VersionTableTh>
                    <VersionTableTh>izveidots</VersionTableTh>
                    <VersionTableTh>labots</VersionTableTh>
                    <VersionTableTh>darbības</VersionTableTh>
                </tr>
            </thead>
            <tbody>
                {props.versions.map(version => (
                    <tr key={version.id}>
                        <VersionTableTd>{version.versionName}</VersionTableTd>
                        <VersionTableTd>{version.timeLimitMs}</VersionTableTd>
                        <VersionTableTd>{version.memoryLimitMb}</VersionTableTd>
                        <VersionTableTd>{version.createdAt}</VersionTableTd>
                        <VersionTableTd>{version.updatedAt}</VersionTableTd>
                        <VersionTableTd>
                            <button className="btn btn-info">rediģēt</button>
                            <button className="btn btn-error">dzēst</button>
                        </VersionTableTd>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const VersionTableTh = ({ children }: { children: React.ReactNode }) => (
    <th scope="col" className="px-6 py-3 text-left uppercase border border-solid">
        {children}
    </th>
)

const VersionTableTd = ({ children }: { children: React.ReactNode }) => (
    <td className="px-6 py-4  border border-solid">
        <div className="text-sm text-gray-900">{children}</div>
    </td>
)
