import NavBar from '@/components/NavBar'
import { gql, useQuery, useMutation } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import Link from 'next/link'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import DangerButton from '@/components/DangerButton'
import Modal from '@/components/Modal'
import { useEffect, useState } from 'react'

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

function TaskTable() {
	const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })
	const [createTask] = useMutation(CREATE_TASK, { client: apolloClient })

	const [tasks, setTasks] = useState<Task[]>([])

	const [newTaskId, setNewTaskId] = useState<string>("")
	const [newTaskFullName, setNewTaskFullName] = useState<string>("")

	useEffect(() => {
		if (data) {
			setTasks(data.listTasks)
		}
	}, [data])

	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>


	function handleOpenCreateTaskModal() {
		setIsCreateTaskModalOpen(true);
	}

	function handleCloseCreateTaskModal() {
		setIsCreateTaskModalOpen(false);
	}

	async function handleCreateTask() {
		try {
			let response = await createTask({ variables: { id: newTaskId, fullName: newTaskFullName } })
			if (response.data.createTask) {
				setTasks([...tasks, response.data.createTask])
				setIsCreateTaskModalOpen(false)
			}
		} catch (e: any) {
			if (e.message)
				alert(e.message)
			else
				alert("nezināma kļūda")
		}

	}

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
			<div className="self-start mt-4">
				<SecondaryButton text="pievienot jaunu uzdevumu" onClick={handleOpenCreateTaskModal} />
			</div>
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
				<PrimaryButton text="skatīt kā lietotājs" />
			</Link>
			<Link href={`/tasks/edit/${props.taskID}`}>
				<SecondaryButton text="rediģēt" />
			</Link>
			<div>
				<DangerButton text='dzēst' onClick={() => handleDeleteTask(props.taskID)} />
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