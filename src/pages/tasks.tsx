import {gql, useQuery} from '@apollo/client'
import apolloClient from '@/lib/apolloClient'
import {useEffect, useState} from 'react'
import NavigationBar from '@/components/NavigationBar'
import Task from '@/types/task'
import CreateTaskDialog from '@/components/CreateTaskModal'
import Link from 'next/link'
import {Chip} from "@mui/joy";

export default function Tasks() {
    const [createTaskDialogOpened, setCreateTaskDialogOpened] = useState<boolean>(false)

    return (
        <>
            <CreateTaskDialog open={createTaskDialogOpened} handleClose={() => setCreateTaskDialogOpened(false)}/>
            <NavigationBar active='tasks'/>
            <main className="container m-auto">

                <TaskDisplay code={"summa"} name={"Summa"} description={"Saskaiti divus skaitļus A un B."}
                             tags={["matemātika", "pilnā pārlase"]} difficulty={"easy"}/>
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

interface TaskDisplayProps {
    code: string;
    name: string;
    description: string;
    tags: string[];
    difficulty: "easy" | "medium" | "hard";
}

function TaskDisplay(props: TaskDisplayProps) {
    return (
        <div className="flex flex-col rounded-lg p-5 bg-white">
            <h3 className="text-xl font-semibold my-0">{props.name}</h3>
            <p className="text-gray-500">{props.description}</p>
            <div className={"w-full flex justify-between"}>
                <div className="flex flex-row flex-wrap gap-2">
                    {props.tags.map(tag => (
                        <Chip key={tag} variant="outlined" size="md">{tag}</Chip>
                    ))}
                </div>
                <Chip variant="solid" color={"success"} size="md">{props.difficulty}</Chip>
            </div>
        </div>
    )

}