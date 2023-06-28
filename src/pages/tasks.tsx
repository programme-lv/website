import NavBar from '@/components/NavBar'
import { gql, useQuery } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import Link from 'next/link'

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
            memoryLimitMb
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

export default function Tasks() {
	return (
		<main className='p-5'>
			<NavBar />
			<h1>tasks.tsx</h1>
			<TaskTable />
		</main>
	)
}

function TaskTable() {
	const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>

	return (
		<table className="min-w-full border-collapse text-sm">
			<thead>
				<tr>
					<TaskTableTh>kods</TaskTableTh>
					<TaskTableTh>pilnais nosaukums</TaskTableTh>
					<TaskTableTh>avots</TaskTableTh>
					<TaskTableTh>autori</TaskTableTh>
					<TaskTableTh>darbības</TaskTableTh>
				</tr>
			</thead>
			<tbody>
				{data.listTasks.map((task: any) => (
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
	)
}

type TaskActionsProps = {
	taskID: string
}

// view as user, edit as admin, delete as admin
function TaskActions(props: TaskActionsProps) {
	function handleDeleteTask() {
		alert("nu, nedzēs manu vienīgo uzdevumu! >:(")
	}
	return (
		<div className="flex gap-3 text-lg">
			<Link href={`/tasks/${props.taskID}`}>
				<button>skatīt kā lietotājs</button>
			</Link>
			<Link href={`/tasks/edit/${props.taskID}`}>
				<button>rediģēt</button>
			</Link>
			<button onClick={handleDeleteTask}>dzēst</button>
		</div>
	)
}

const TaskTableTh = (props: { children: any }) => (
	<th scope="col" className="px-6 py-3 text-left uppercase border border-solid">
		{props.children}
	</th>
)

const TaskTableTd = (props: { children: any }) => (
	<td className="px-6 py-4  border border-solid">
		<div className="text-sm text-gray-900">{props.children}</div>
	</td>
)