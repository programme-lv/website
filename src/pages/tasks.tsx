import {useState} from 'react'
import NavigationBar from '@/components/NavigationBar'
import {Chip} from "@mui/joy";
import {graphql} from "@/gql";
import apolloClient from "@/lib/apolloClient";
import renderMD from "@/utils/render";
import {ListPublishedTasksQuery} from "@/gql/graphql";
import "katex/dist/katex.min.css"

export default function Tasks(props: ListPublishedTasksQuery) {

    console.log(props.listPublishedTasks[0].description.story)
    return (
        <>
            <NavigationBar active='tasks'/>
            <main className="container m-auto">
                {
                    props.listPublishedTasks.map(task => (
                        <TaskDisplay key={task.id} code={task.code} name={task.name}
                                     description={task.description.story}
                                     tags={["matemātika", "pilnā pārlase"]} difficulty={"easy"}/>
                    ))
                }
            </main>
        </>
    )
}


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
            <div className="text-gray-600" dangerouslySetInnerHTML={{__html: props.description}}></div>
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

export const GET_TASKS = graphql(`
query ListPublishedTasks {
    listPublishedTasks {
        id
        code
        name
        createdAt
        updatedAt
        description {
            id
            story
            input
            output
            notes
            examples {
                id
                input
                output
            }
        }
        constraints {
            timeLimitMs
            memoryLimitKb
        }
        metadata {
            authors
            origin
        }
        tests {
            id
            name
            input
            answer
        }
    }
}
`)

export async function getServerSideProps() {
    const {data} = await apolloClient.query({
        query: GET_TASKS,
    })

    if (data) {
        const d = data.listPublishedTasks
        for (let task of d) {
            task.description.story = renderMD(task.description.story)
            task.description.input = renderMD(task.description.input)
            task.description.output = renderMD(task.description.output)
        }
    }

    return {
        props: data
    }
}

