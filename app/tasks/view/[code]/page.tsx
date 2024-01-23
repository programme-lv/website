import queryTaskDescription from "./queryTaskDesc"

export default async function TaskView(props: any) {
    const task = await queryTaskDescription(props.params.code)
    return (
        <div>
            {task.description.story}
        </div>
    )
}