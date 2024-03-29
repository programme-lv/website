import { GetPublishedTaskVersionByCodeQuery } from "@/gql/graphql";
import Divider from "@mui/material/Divider";

type TaskDisplayProps = {
    task: GetPublishedTaskVersionByCodeQuery["getPublishedTaskVersionByCode"]
}

export default function TaskDisplay(props: TaskDisplayProps) {
    const { task } = props;
    return (
        <>
            <div className={"flex-col sm:flex-row flex sm:gap-4 justify-between items-center"}>
                <h2 className={"font-medium mt-2 mb-0 sm:mb-2 whitespace-nowrap"}>{task.name}</h2>
                <table className="table-fixed min-w-[10em] my-2 table lg:hidden">
                    <thead><tr><td></td><td className="w-24 text-right"></td></tr></thead>
                    <tbody>
                        <tr><td className="text-right text-gray-600">laiks:</td>
                            <td className="text-right">{task.constraints.timeLimitMs} ms</td></tr>
                        <tr><td className="text-right text-gray-600">atmiņa:</td>
                            <td className="text-right">{task.constraints.memoryLimitKb} kB</td></tr>
                    </tbody>
                </table>
                <table className="table-fixed min-w-[10em] my-2 lg:table hidden">
                    <tbody>
                        <tr><td className="text-right text-gray-600">laiks:</td>
                            <td className="text-right pe-4">{task.constraints.timeLimitMs} ms</td>
                        <td className="text-right text-gray-600">atmiņa:</td>
                            <td className="text-right">{task.constraints.memoryLimitKb} kB</td></tr>
                    </tbody>
                </table>

            </div>
            <Divider orientation={"horizontal"} />
            <div className={"flex flex-col gap-4 pb-4"}>
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
        <td className={"p-2 border border-gray-300 border-solid align-top font-medium"}><code><pre className={"p-0 m-0"}>{props.children}</pre></code></td>
    )
}