import { gql, useQuery } from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import { useEffect, useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import JoyButton from '@mui/joy/Button'
import Task from '@/types/task'
import CreateTaskDialog from '@/components/CreateTaskModal'
import Link from 'next/link'

export default function Tasks() {
  const [createTaskDialogOpened, setCreateTaskDialogOpened] = useState<boolean>(false)

  return (
    <>
      <CreateTaskDialog open={createTaskDialogOpened} handleClose={() => setCreateTaskDialogOpened(false)} />
      <NavigationBar active='tasks' />
      <main className="container m-auto">
        <div className="w-full my-5">
          <TaskTable />
        </div>
        <div className="flex justify-end">
          <JoyButton onClick={() => setCreateTaskDialogOpened(true)} className='font-normal'>Izveidot</JoyButton>
        </div>
      </main>
    </>
  )
}


export const GET_TASKS = gql`
query ListTasks {
    listTasks {
        id
        code
        name
    }
}
`

function TaskTable() { // TODO: convert to server side rendering
  const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => { if (data) setTasks(data.listTasks) }, [data])


  if (loading) return <p>ielādē uzdevumus</p>
  if (error) return <p>kļūda: {error.message}</p>


  return (
    <table className="proglvtable text-sm">
      <thead>
        <tr>
          <th className="w-[10em] text-center capitalize">ID</th>
          <th className="text-left capitalize">uzdevums</th>
          <th className="w-[5em] text-center capitalize">iesūtījumi</th>
          <th className="w-[5em] text-center capitalize">atrisinājuši</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task: Task) => <TaskTableRow key={task.id} task={task} />)}
      </tbody>
    </table>
  )
}

function TaskTableRow({ task }: { task: Task }) {
  const tags = ['matemātika', 'skaitļu teorija', 'pilnā pārlase'];
  return (
    <tr key={task.id}>
      <td className="text-center">{task.code}</td>
      <td>
        <div className="flex justify-between">
          <Link href={`tasks/${task.code}`} className="no-underline hover:underline">
            <span className="text-blue-69">{task.name}</span>
          </Link>
          <div className="flex gap-1 text-sm font-normal text-gray-500">
            {tags.join(', ')}
          </div>
        </div>
      </td>
      <td className="text-center">0</td>
      <td className="text-center">0</td>
    </tr>
  )
}
