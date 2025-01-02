import { Submission, Subtask, TestGroup, Verdict } from "@/types/proglv";
import { SubmListScoreBar } from "./subm-table-score-bars";
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
                                eval_stage={subm.curr_eval.eval_stage}
                                score_unit={subm.curr_eval.score_unit}
                                subtasks={subm.curr_eval.subtasks}
                                test_groups={subm.curr_eval.test_groups}
                                test_verdicts={subm.curr_eval.test_verdicts}
                            />
                            )}
                        </td>
                        <td className="p-2 py-2.5 border-r">
                            {subm.curr_eval && (
                            <SubmTableResultFractionCell
                                eval_stage={subm.curr_eval.eval_stage}
                                score_unit={subm.curr_eval.score_unit}
                                subtasks={subm.curr_eval.subtasks}
                                test_groups={subm.curr_eval.test_groups}
                                    test_verdicts={subm.curr_eval.test_verdicts}
                                />
                            )}
                        </td>
                        <td className="p-2 py-2.5 border-r">{subm.curr_eval ? statusTranslations[subm.curr_eval.eval_stage] ?? subm.curr_eval.eval_stage : "..."}</td>
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

function SubmTableDateTimeCell({ dateTime }: { dateTime: string }) {
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
    score_unit: string;
    subtasks: Subtask[];
    test_groups: TestGroup[];
    test_verdicts: Verdict[];
}

function SubmTableResultBarCell({ score_unit, eval_stage, test_groups, test_verdicts }: SubmTableResultCellProps) {
    if (score_unit === "test") {
        let accepted = test_verdicts.filter(v => v === "ac").length;
        let untested = test_verdicts.filter(v => v === "q").length;
        let testing = test_verdicts.filter(v => v === "t").length;
        let wrong = test_verdicts.length - accepted - untested - testing;
        return <SubmListScoreBar green={accepted} red={wrong} gray={untested} yellow={testing} />;
    }
    if (score_unit === "group") {
        // let accepted_groups = []; // list of test group indices where all tests are accepted
        let accepted_points=0; // sum of test group points where all tests are accepted
        // let wrong_groups = []; // list of test group indices where at least one test is wrong
        let wrong_points = 0; // sum of test group points where at least one test is wrong
        // let untested_groups = []; // list of test group indices where all tests are in queue
        let untested_points=0; // sum of test group points where all tests are in queue
        // let testing_groups = []; // list of test group indices where at least one test is testing but the group is not in other categories
        let testing_points=0; // sum of test group points where at least one test is testing
        for (let i = 0; i < test_groups.length; i++) {
            let group = test_groups[i];
            let tests = group.tg_tests;
            let tests_accepted = tests.filter(t => test_verdicts[t-1] === "ac").length;
            let tests_untested = tests.filter(t => test_verdicts[t-1] === "q").length;
            let tests_testing = tests.filter(t => test_verdicts[t-1] === "t").length;
            let tests_wrong = tests.length - tests_accepted - tests_untested - tests_testing;
            if (tests_accepted === tests.length) {
                // accepted_groups.push(i);
                accepted_points += group.points;
            } else if (tests_wrong > 0) {
                // wrong_groups.push(i);
                wrong_points += group.points;
            } else if (tests_untested === tests.length) {
                // untested_groups.push(i);
                untested_points += group.points;
            } else {
                // testing_groups.push(i);
                testing_points += group.points;
            }
        }
        return <SubmListScoreBar green={accepted_points} red={wrong_points} gray={untested_points} yellow={testing_points} />;
    }
    if (score_unit === "subtask") {

    }
    return <></>;
}

function SubmTableResultFractionCell({ score_unit, eval_stage, test_groups, test_verdicts }: SubmTableResultCellProps) {
    if (score_unit === "test") {
        let accepted = test_verdicts.filter(v => v === "ac").length;
        let untested = test_verdicts.filter(v => v === "q").length;
        let wrong = test_verdicts.length - accepted - untested;
        return <div className="flex flex-wrap gap-x-1 gap-y-1 min-w-20">
            <span>{accepted}</span>
            <span>/</span>
            <span>{accepted + wrong + untested}</span>
        </div>;
    }
    if (score_unit === "group") {
        let accepted_points = 0;
        let wrong_points = 0;
        let untested_points = 0;
        let testing_points = 0;
        for (let i = 0; i < test_groups.length; i++) {
            let group = test_groups[i];
            let tests = group.tg_tests;
            let tests_accepted = tests.filter(t => test_verdicts[t-1] === "ac").length;
            let tests_untested = tests.filter(t => test_verdicts[t-1] === "q").length;
            let tests_testing = tests.filter(t => test_verdicts[t-1] === "t").length;
            let tests_wrong = tests.length - tests_accepted - tests_untested - tests_testing;
            if (tests_accepted === tests.length) {
                accepted_points += group.points;
            } else if (tests_wrong > 0) {
                wrong_points += group.points;
            } else if (tests_untested === tests.length) {
                untested_points += group.points;
            } else {
                testing_points += group.points;
            }
        }
        return <div className="flex flex-wrap gap-x-1 gap-y-1 min-w-20">
            <span>{accepted_points}</span>
            <span>/</span>
            <span>{accepted_points + wrong_points + untested_points + testing_points}</span>
        </div>;
    }
    if (score_unit === "subtask") {

    }
    return <></>;
}