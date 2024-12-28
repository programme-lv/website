import { Submission, TestGroup, TestSet } from "@/types/proglv";
import { TestGroupScoringBar, TestSetScoringBar, ErrorScoringBar } from "./subm-table-score-bars";
import { cn } from "./cn";
import Link from "next/link";

export const statusTranslations: Record<string, string> = {
    waiting: "Gaida",
    received: "Sagatavo",
    compiling: "Kompilē",
    testing: "Testē",
    finished: "Izvērtēts",
    error: "Servera kļūda",
    compile_error: "Kompilācijas kļūda",
    runtime_error: "Izpildes kļūda",
    checker_error: "Servera kļūda",
    internal_error: "Servera kļūda",
  };

type SubmissionTableProps = {
    submissions: Submission[];
    skeleton: boolean;
}

export default function SubmissionTable({ submissions, skeleton }: SubmissionTableProps) {

    if (skeleton) {
        return (
            <table className="w-full rounded-sm table-fixed">
                <colgroup>
                <col width="200px"/>
                <col width="140px"/>
                <col width="140px"/>
                <col width="120px"/>
                <col width="160px"/>
                <col width="160px" />
                <col width="120px" />
            </colgroup>
            <thead>
                <tr className="border-b border-gray-300 text-gray-900 text-sm">
                    <th className="p-2 text-left font-normal border-r">Datums & laiks</th>
                    <th className="p-2 text-left font-normal border-r">Autors</th>
                    <th className="p-2 text-left font-normal border-r">Uzdevums</th>
                    <th className="p-2 text-left font-normal border-r">Valoda</th>
                    <th className="p-2 text-left font-normal border-r">Rezultāts</th>
                    <th className="p-2 text-left font-normal border-r">Statuss</th>
                    <th className="p-2 text-left font-normal">Iesūtījums</th>
                </tr>
            </thead>
            <tbody>
                {Array.from({length: 30}).map((_, i) => (
                    <tr key={i} className={cn({"border-b border-divider": i !== 29}, { "bg-gray-50": i % 2 === 0 })}>
                        <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                        <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                        <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                        <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                        <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                        <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                        <td className="p-2.5 py-2.5 animate-pulse"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                    </tr>
                ))}
            </tbody>
        </table>
        );
    }

    return (
        <table className="w-full rounded-sm table-fixed">
            <colgroup>
                <col width="200px"/>
                <col width="140px"/>
                <col width="140px"/>
                <col width="120px"/>
                <col width="160px"/>
                <col width="160px" />
                <col width="120px" />
            </colgroup>
            <thead>
                <tr className="border-b border-gray-300 text-gray-900 text-sm">
                    <th className="p-2 text-left font-normal border-r">Datums & laiks</th>
                    <th className="p-2 text-left font-normal border-r">Autors</th>
                    <th className="p-2 text-left font-normal border-r">Uzdevums</th>
                    <th className="p-2 text-left font-normal border-r">Valoda</th>
                    <th className="p-2 text-left font-normal border-r">Rezultāts</th>
                    <th className="p-2 text-left font-normal border-r">Statuss</th>
                    <th className="p-2 text-left font-normal">Iesūtījums</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((subm, i) => (
                    <tr key={i} className={cn({"border-b border-divider ": i !== submissions.length - 1}, { "bg-gray-50": i % 2 === 0 })}>
                        <td className="p-2 py-2.5 border-r"><SubmTableDateTimeCell dateTime={subm.created_at} /></td>
                        <td className="p-2 py-2.5 border-r text-green-800 font-medium">{subm.username}</td>
                        <td className="p-2 py-2.5 border-r">
                            <Link href={`/tasks/${subm.task_id}`} className="text-blue-900 hover:underline decoration-blue-600/20 underline-offset-2  hover:decoration-blue-900/90">
                                {subm.task_name}
                            </Link>
                        </td>
                        <td className="p-2 py-2.5 border-r">{subm.pr_lang.display}</td>
                        <td className="p-2 py-2.5 border-r"><SubmTableResultCell {...subm.curr_eval} /></td>
                        <td className="p-2 py-2.5 border-r">{statusTranslations[subm.curr_eval.eval_stage] ?? subm.curr_eval.eval_stage}</td>
                        <td className="p-2 py-2.5">
                            <Link href={`/submissions/${subm.subm_uuid}`} className="text-blue-900 hover:underline underline-offset-2 hover:decoration-blue-900/90">
                                {subm.subm_uuid.slice(0, 8)}
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}


{/* <table className="w-full rounded-sm">
<tbody>
    {statement_subtasks.map((subtask, i) => (
        <tr key={i} className={cn({"border-b border-divider": i !== statement_subtasks.length - 1}, { "bg-gray-50": i % 2 === 0 })}>
            <td className="px-2 py-1.5 max-w-[3em] min-w-[2em] border-r border-gray-200 text-center">{subtask.subtask}.</td>
            <td className="px-2 py-1.5">
                <div
                    dangerouslySetInnerHTML={{
                        __html: renderMdLite(subtask.descriptions["lv"]),
                    }}
                />
            </td>
            <td className="px-2 py-1.5 max-w-[6em] min-w-[4em] border-l border-gray-200"><span className="font-medium">{subtask.score}</span> p.</td>
        </tr>
    ))}
</tbody>
</table> */}

function SubmTableDateTimeCell({dateTime}: {dateTime: string}) {
    let date = new Date(dateTime).toLocaleString("lv").split(" ")[0];
    let time = new Date(dateTime).toLocaleString("lv").split(" ")[1];
    if (date.split(".")[0].length < 2) {
        date = "0" + date;
    }
    return (
        <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
            <span>{date}</span>
            <span>{time}</span>
        </div>
    )
}

type SubmTableResultCellProps = {
    eval_stage: string;
    test_groups?: TestGroup[];
    test_set?: TestSet;
}

function SubmTableResultCell({ eval_stage, test_groups, test_set }: SubmTableResultCellProps) {
    if (eval_stage.includes("error")) {
        return <ErrorScoringBar />;
    }
    if (test_groups && test_groups.length > 0) {
        return <TestGroupScoringBar testgroups={test_groups} />;
    }
    if (test_set) {
        return <TestSetScoringBar testset={test_set} />;
    }
    return <></>;
}