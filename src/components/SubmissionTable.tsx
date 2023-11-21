import {ListPublicSubmissionsQuery} from "@/gql/graphql";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

type SubmissionTableProps = {
    submissions: ListPublicSubmissionsQuery
}

export default function SubmissionTable(props: SubmissionTableProps) {
    return (
        <table className={"bg-white border-collapse w-full border border-solid border-gray-200 h-fit"}>
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
                        totalScore={submission.evaluation.totalScore}
                        possibleScore={submission.evaluation.possibleScore ?? undefined}
                        totalTimeMs={submission.evaluation.totalTimeMs ?? undefined}
                        maxTimeMs={submission.evaluation.maxTimeMs ?? undefined}
                    />
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
    totalScore: number,
    possibleScore?: number,
    totalTimeMs?: number,
    maxTimeMs?: number,
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
        <HeaderCell>Laiks</HeaderCell>
        <HeaderCell>Atmiņa</HeaderCell>
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

const getBackgroundColor = (score: number) => {
    // Scale score from 0-1 to 0-100
    let scaledScore = score * 100;
    let red, green, blue, alpha = 0.7; // Fixed alpha for controlled brightness

    if (scaledScore <= 33) {
        // Interpolate between red (255,0,0) and yellow (255,255,0)
        red = 255;
        green = Math.round(255 * (scaledScore / 33));
        blue = 0;
    } else {
        // Interpolate between yellow (255,255,0) and green (0,128,0)
        red = Math.round(255 * ((100 - scaledScore) / 67));
        green = 255 - red;
        blue = 0;
    }

    return `rgba(${red}, ${green}, ${blue}, ${0.3})`;
};

function StatusSpan(props: { status: string, totalScore: number, possibleScore: number | undefined }) {
    const {t} = useTranslation('common');
    const {status, totalScore, possibleScore} = props;
    // return status unless status == "F", in which case return totalScore / possibleScore
    if (status === "F") return (
        <span style={{backgroundColor: getBackgroundColor(0 / (possibleScore ?? totalScore))}}
              className={"w-full h-full bg-green-69 flex justify-center align-middle items-center"}>
            {totalScore + " / " + possibleScore}
        </span>);
    return (
        <span className={"w-full h-full flex justify-center align-middle items-center"}>
            {t(status)}
        </span>);
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
            <tr className={"hover:bg-gray-100 border h-full"}>
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
                <td className={"border-x border-y-0 border-gray-200 border-solid text-center"}>
                    <StatusSpan status={props.status} totalScore={props.totalScore}
                                possibleScore={props.possibleScore}/>
                </td>
                <td>
                    {(props.totalTimeMs && props.maxTimeMs) ? (
                        <div className={"flex gap-2 justify-center"}>
                            <div className={"flex flex-col gap-2"}>
                                <div>avg:</div>
                                <div>max:</div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <div>{(props.totalTimeMs / 1000).toFixed(3)} s.</div>
                                <div>{(props.maxTimeMs / 1000).toFixed(3)} s.</div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </td>
                <td>
                    {props.possibleScore}
                </td>
            </tr>
        </>
    )
}
