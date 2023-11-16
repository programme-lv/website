import {ListPublicSubmissionsQuery} from "@/gql/graphql";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

type SubmissionTableProps = {
    submissions: ListPublicSubmissionsQuery
}

export default function SubmissionTable(props: SubmissionTableProps) {
    return (
        <table className={"bg-white border-collapse w-full border border-solid border-gray-200"}>
            <SubmissionTableHeaderRow/>
            <tbody>
            {
                props.submissions.listPublicSubmissions.map(submission => (
                    <SubmissionTableRow
                        key={submission.id}
                        time={submission.createdAt}
                        taskFullName={submission.task.name}
                        taskCode={submission.task.code}
                        username={submission.username}
                        language={submission.language.fullName}
                        status={submission.evaluation.status}
                        result={(submission.evaluation.totalScore != null && submission.evaluation.possibleScore != null) ?
                            submission.evaluation.totalScore + " / " + submission.evaluation.possibleScore :
                            "- / -"}/>
                ))
            }
            </tbody>
        </table>
    )
}

type SubmissionTableRowProps = {
    time: string,
    taskFullName: string,
    taskCode: string,
    username: string,
    language: string,
    status: string | "IQ" | "R" | "C" | "T" | "F" | "CE" | "RJ",
    result?: string,
}

function SubmissionTableHeaderRow() {
    function HeaderCell(props: { children: any }) {
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

function SubmissionTableRow(props: SubmissionTableRowProps) {
    const {t} = useTranslation('common');

    function Cell(props: { children: any, className?: string }) {
        return (
            <td className={"border-x border-y-0 border-gray-200 border-solid py-3 text-center " + (props.className ?? "")}>{props.children}</td>
        )
    }

    let statusSpan = <span className={"text-gray-420 font-medium"}>{t(props.status)}</span>
    if (props.status === "F") statusSpan = <span className={"text-green-69 font-medium"}>{t(props.status)}</span>
    else if (props.status === "T" || props.status == "C") statusSpan =
        <span className={"text-yellow-69 font-medium"}>{t(props.status)}</span>
    else if (props.status === "CE" || props.status == "RJ") statusSpan =
        <span className={"text-red-500"}>{t(props.status)}</span>
    return (
        <tr className={"hover:bg-gray-100 border"}>
            <Cell className={"px-6 w-40"}>{props.time}</Cell>
            <Cell><Link href={`/tasks/${props.taskCode}`}
                        className={"no-underline text-gray-420 font-medium"}>{props.taskFullName}</Link></Cell>
            <Cell>{props.username}</Cell>
            <Cell>{props.language}</Cell>
            <Cell>{statusSpan}</Cell>
            <Cell>{props.result ?? '- / -'}</Cell>
        </tr>
    )
}
