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

function formatTime(time: string) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
        <>
            <tr className={"hover:bg-gray-100 border"}>
                <td className={"border-x border-y-0 border-gray-200 border-solid py-3 text-center px-6 w-40"}>
                    <div className={"flex flex-col gap-1"}>
                        <span>{formatTime(props.time).slice(0, 10)}</span>
                        <span>{formatTime(props.time).slice(11)}</span>
                    </div>
                </td>
                <td className={"text-center border-x border-y-0 border-solid border-gray-200"}><Link
                    href={`/tasks/${props.taskCode}`}
                    className={"no-underline text-gray-420 font-medium"}>{props.taskFullName}</Link></td>
                <Cell>{props.username}</Cell>
                <Cell>{props.language}</Cell>
                <td className={"border-x border-y-0 border-gray-200 border-solid py-3 text-center "}>{statusSpan}</td>
                <Cell>{props.result ?? '- / -'}</Cell>
            </tr>
        </>
    )
}
