import NavigationBar from "@/components/NavigationBar";
import Link from "next/link";

export default function Submissions() {

    return (
        <div>
            <NavigationBar active='submissions'/>
            <main className="container m-auto mt-6">
                <table className={"bg-white border-collapse w-full border border-solid"}>
                    <SubmissionTableHeaderRow/>
                    <tbody>
                        <SubmissionTableRow
                            time={"2021-10-10 12:00:00"}
                            taskFullName={"A+B"}
                            taskCode={"ab"}
                            username={"KrisjanisP"}
                            language={"C++"}
                            status={"IQ"}/>
                        <SubmissionTableRow
                            time={"2021-10-10 12:00:00"}
                            taskFullName={"Saskaiti skaitļus!"}
                            taskCode={"summa"}
                            username={"AnsisG"}
                            language={"C++"}
                            status={"T"}
                            result={"56 / 100"}/>
                        <SubmissionTableRow
                            time={"2021-10-10 12:00:00"}
                            taskFullName={"A+B"}
                            taskCode={"ab"}
                            username={"Umnik"}
                            language={"C++"}
                            status={"F"}
                            result={"100 / 100"}/>
                    </tbody>
                </table>
            </main>
        </div>
    )
}

type SubmissionTableRowProps = {
    time: string,
    taskFullName: string,
    taskCode: string,
    username: string,
    language: string,
    status: "IQ" | "R" | "C" | "T" | "F" | "CE" | "RJ",
    result?: string,
}

function SubmissionTableHeaderRow(){
    function HeaderCell(props: {children: any}) {
        return (
            <th className={"border border-none font-normal py-3"}>{props.children}</th>
        )
    }
    return (<thead className={"bg-gray-420 text-white"}>
    <tr>
        <HeaderCell>Iesūtīts</HeaderCell>
        <HeaderCell>Uzdevums</HeaderCell>
        <HeaderCell>Autors</HeaderCell>
        <HeaderCell>Valoda</HeaderCell>
        <HeaderCell>Statuss</HeaderCell>
        <HeaderCell>Rezultāts</HeaderCell>
    </tr>
    </thead>)

}
function SubmissionTableRow(props:SubmissionTableRowProps) {
    function Cell(props: {children: any, className?: string}) {
        return (
            <td className={"border-x border-y-0 border-gray-420 border-solid font-normal py-3 text-center "+(props.className??"")}>{props.children}</td>
        )
    }
    return (
        <tr className={"hover:bg-gray-100"}>
            <Cell className={"px-6 w-40"}>{props.time}</Cell>
            <Cell><Link href={`/tasks/${props.taskCode}`}>{props.taskFullName}</Link></Cell>
            <Cell>{props.username}</Cell>
            <Cell>{props.language}</Cell>
            <Cell>{props.status}</Cell>
            <Cell>{props.result ?? '- / -'}</Cell>
        </tr>
    )
}