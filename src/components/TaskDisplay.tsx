import { GetPublishedTaskVersionByCodeQuery } from "@/gql/graphql";
import Divider from "@mui/material/Divider";

type TaskDisplayProps = {
    task: GetPublishedTaskVersionByCodeQuery["getPublishedTaskVersionByCode"]
}

export default function TaskDisplay(props: TaskDisplayProps) {
    const { task } = props;
    return (
        <>
            <div className={"flex items-baseline justify-between"}>
                <h2 className={"font-medium my-4 mb-2"}>{task.name}</h2>
                <div className={"flex gap-4"}>
                    <div><span
                        className={"text-gray-600"}>laiks:</span> {task.constraints.timeLimitMs} ms
                    </div>
                    <div><span
                        className={"text-gray-600"}>atmiņa:</span> {task.constraints.memoryLimitKb} kB
                    </div>
                </div>
            </div>
            <Divider orientation={"horizontal"} />
            <div className={"flex flex-col gap-4"}>
                <StatementSection title="Stāsts" content={task.description.story} />
                <StatementSection title="Ievaddatu apraksts" content={task.description.input} />
                <StatementSection title="Izvaddatu apraksts" content={task.description.output} />
                {task.description.examples && <StatementExamples examples={task.description.examples} />}
            </div>
        </>
    )
}

function StatementSection(props: { title: string, content: string }) {
    return (
        <div>
            <h3 className={"font-medium"}>{props.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
        </div>
    )
}

function StatementExamples(props: { examples: { id: string, input: string, answer: string }[] }) {
    return (
        <div>
            <h3 className={"font-medium"}>Testu piemēri</h3>
            <div className={"flex flex-col gap-4"}>
                {props.examples.map(example => (
                    <table key={example.id} className={"border-collapse w-full"}>
                        <thead>
                            <tr>
                                <HeaderCell>Ievaddati</HeaderCell>
                                <HeaderCell>Izvaddati</HeaderCell>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <BodyCell>{example.input}</BodyCell>
                                <BodyCell>{example.answer}</BodyCell>
                            </tr>
                        </tbody>
                    </table>
                ))}
            </div>
        </div>
    )
}

function HeaderCell(props: { children: string }) {
    return (
        <th className={"p-2 py-1 border border-gray-300 border-solid font-light text-left"}>{props.children}</th>
    )
}

function BodyCell(props: { children: string }) {
    return (
        <td className={"p-2 border border-gray-300 border-solid font-bold"}><code>{props.children}</code></td>
    )
}