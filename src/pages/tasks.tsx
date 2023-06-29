import NavBar from '@/components/NavBar'
import { gql, useQuery } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import Link from 'next/link'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import DangerButton from '@/components/DangerButton'

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

export default function Tasks() {
	return (
		<main className='p-5'>
			<NavBar active='tasks' />
			<TaskTable />
		</main>
	)
}

function TaskTable() {
	const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>

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
		</div>
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
		<div className="flex gap-3 justify-center items-center ">
			<Link href={`/tasks/${props.taskID}`}>
				<PrimaryButton text="skatīt kā lietotājs" />
			</Link>
			<Link href={`/tasks/edit/${props.taskID}`}>
				<SecondaryButton text="rediģēt" />
			</Link>
			<div>
			<DangerButton text='dzēst' onClick={handleDeleteTask}/>
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