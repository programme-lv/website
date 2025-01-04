import { Submission, Subtask, TestGroup, Verdict } from "@/types/proglv";
import { SubmListScoreBar } from "./subm-table-score-bars";
import { cn } from "./cn";
import Link from "next/link";
import { calculateGroupScores, calculateTestScores } from "@/lib/score-subm";

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

export const errorTranslations: Record<string, string> = {
    "compilation": "Kompilācijas kļūda",
    "internal": "Servera kļūda",
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
                        <td className="p-2 py-2.5 border-r">{subm.pr_lang.display}</td>
                        <td className="p-2 py-2.5 border-r">
                            {subm.curr_eval && (
                                <SubmTableResultBarCell
                                    score_unit={subm.curr_eval.score_unit}
                                    test_groups={subm.curr_eval.test_groups}
                                    test_verdicts={subm.curr_eval.test_verdicts}
                                    has_error={!!subm.curr_eval.eval_error}
                                />
                            )}
                        </td>
                        <td className="p-2 py-2.5 border-r">
                            {subm.curr_eval && (
                                <SubmTableResultFractionCell
                                    score_unit={subm.curr_eval.score_unit}
                                    test_groups={subm.curr_eval.test_groups}
                                    test_verdicts={subm.curr_eval.test_verdicts}
                                    has_error={!!subm.curr_eval.eval_error}
                                />
                            )}
                        </td>
                        <td className="p-2 py-2.5 border-r">{subm.curr_eval ? (errorTranslations[subm.curr_eval.eval_error] ?? statusTranslations[subm.curr_eval.eval_stage]) ?? ( subm.curr_eval.eval_error ? subm.curr_eval.eval_error : subm.curr_eval.eval_stage) : "..."}</td>
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

type SubmTableResultCellProps = {
    score_unit: string;
    test_groups: TestGroup[];
    test_verdicts: Verdict[];
    has_error: boolean;
}

function SubmTableResultBarCell({ score_unit, test_groups, test_verdicts, has_error }: SubmTableResultCellProps) {
    if(has_error) {
        return <SubmListScoreBar green={0} red={0} gray={0} yellow={0} purple={1} />;
    }
    if (score_unit === "test") {
        const { accepted, untested, wrong, testing } = calculateTestScores(test_verdicts);
        return <SubmListScoreBar green={accepted} red={wrong} gray={untested} yellow={testing} />;
    }
    if (score_unit === "group") {
        const { accepted_points, wrong_points, untested_points, testing_points } = calculateGroupScores(test_groups, test_verdicts);
        return <SubmListScoreBar green={accepted_points} red={wrong_points} gray={untested_points} yellow={testing_points} />;
    }
    return <></>;
}


function SubmTableResultFractionCell({ score_unit, test_groups, test_verdicts }: SubmTableResultCellProps) {
    if (score_unit === "test") {
        const { accepted, untested, wrong } = calculateTestScores(test_verdicts);
        return <div className="flex flex-wrap gap-x-1 gap-y-1 min-w-20">
            <span>{accepted}</span>
            <span>/</span>
            <span>{accepted + wrong + untested}</span>
        </div>;
    }
    if (score_unit === "group") {
        const { accepted_points, wrong_points, untested_points, testing_points } = calculateGroupScores(test_groups, test_verdicts);
        return <div className="flex flex-wrap gap-x-1 gap-y-1 min-w-20">
            <span>{accepted_points}</span>
            <span>/</span>
            <span>{accepted_points + wrong_points + untested_points + testing_points}</span>
        </div>;
    }
    return <></>;
}