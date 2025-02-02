import { Subtask, TestGroup, Verdict } from "@/types/proglv";
import { SubmListScoreBar } from "./subm-table-score-bars";
import { cn } from "./cn";
import Link from "next/link";
import { calculateGroupScores, calculateTestScores } from "@/lib/score-subm";
import { SubmListEntry } from "@/types/subm";

export const statusTranslations: Record<string, string> = {
    waiting: "Gaida",
    received: "Sagatavo",
    compiling: "Kompilē",
    testing: "Testē",
    finished: "Novērtēts",
    error: "Servera kļūda",
    compile_error: "Kompilācijas kļūda",
    runtime_error: "Izpildes kļūda",
    checker_error: "Servera kļūda",
    internal_error: "Servera kļūda",
};

export const errorTranslations: Record<string, string> = {
    "compilation": "Kompilācijas kļūda",
    "internal": "Servera kļūda",
};

type SubmissionTableProps = {
    submissions: SubmListEntry[];
    skeleton: boolean;
}

export default function SubmissionTable({ submissions, skeleton }: SubmissionTableProps) {

    if (skeleton) {
        return (
            <table className="w-full rounded-sm table-fixed">
                <colgroup>
                    <col width="200px" />
                    <col width="140px" />
                    <col width="140px" />
                    <col width="120px" />
                    <col width="120px" />
                    <col width="80px" />
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
                    {Array.from({ length: 30 }).map((_, i) => (
                        <tr key={i} className={cn({ "border-b border-divider": i !== 29 }, { "bg-gray-50": i % 2 === 0 })}>
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
                <col width="200px" />
                <col width="140px" />
                <col width="140px" />
                <col width="120px" />
                <col width="120px" />
                <col width="80px" />
                <col width="120px" />
                <col width="120px" />
            </colgroup>
            <thead>
                <tr className="border-b border-gray-300 text-gray-900 text-sm">
                    <th className="p-2 text-left font-normal border-r">Datums & laiks</th>
                    <th className="p-2 text-left font-normal border-r">Autors</th>
                    <th className="p-2 text-left font-normal border-r">Uzdevums</th>
                    <th className="p-2 text-left font-normal border-r">Valoda</th>
                    <th className="p-2 text-left font-normal border-r" colSpan={2}>Rezultāts</th>
                    <th className="p-2 text-left font-normal border-r">Statuss</th>
                    <th className="p-2 text-left font-normal">Iesūtījums</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((subm, i) => (
                    <tr key={subm.subm_uuid} className={cn({ "border-b border-divider ": i !== submissions.length - 1 }, { "bg-gray-50": i % 2 === 0 })}>
                        <td className="p-2 py-2.5 border-r"><SubmTableDateTimeCell dateTime={subm.created_at} /></td>
                        <td className="p-2 py-2.5 border-r">{subm.username}</td>
                        <td className="p-2 py-2.5 border-r">
                            <Link href={`/tasks/${subm.task_id}`} className="text-blue-900 hover:underline decoration-blue-600/20 underline-offset-2  hover:decoration-blue-900/90">
                                {subm.task_name}
                            </Link>
                        </td>
                        <td className="p-2 py-2.5 border-r">{subm.pr_lang_name}</td>
                        <td className="p-2 py-2.5 border-r">
                            <SubmListScoreBar
                                green={subm.score_info.score_bar.green}
                                red={subm.score_info.score_bar.red}
                                gray={subm.score_info.score_bar.gray}
                                yellow={subm.score_info.score_bar.yellow}
                                purple={subm.score_info.score_bar.purple}
                            />
                        </td>
                        <td className="p-2 py-2.5 border-r">
                            <div className="flex flex-wrap gap-x-1 gap-y-1 min-w-20">
                                <span>{subm.score_info.received_score}</span>
                                <span>/</span>
                                <span>{subm.score_info.possible_score}</span>
                            </div>
                        </td>
                        {/* <td className="p-2 py-2.5 border-r">{subm.curr_eval ? (errorTranslations[subm.curr_eval.eval_error] ?? statusTranslations[subm.curr_eval.eval_stage]) ?? ( subm.curr_eval.eval_error ? subm.curr_eval.eval_error : subm.curr_eval.eval_stage) : "..."}</td> */}
                        <td className="p-2 py-2.5 border-r">{subm.status}</td>
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

function SubmTableDateTimeCell({ dateTime }: { dateTime: string }) {
    const time = new Date(dateTime);
    let date = time.toLocaleString("lv").split(" ")[0];
    let timeStr = time.toLocaleString("lv").split(" ")[1];
    if (date.split(".")[0].length < 2) {
        date = "0" + date;
    }
    return (
        <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
            <span>{date}</span>
            <span>{timeStr}</span>
        </div>
    )
}