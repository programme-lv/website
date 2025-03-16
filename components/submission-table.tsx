import { SubmListScoreBar } from "./subm-table-score-bars";
import { cn } from "./cn";
import { SubmListEntry } from "@/types/subm";
import { TextLink } from "./text-link";

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
    compile_error: "Kompilācijas kļūda",
    internal_error: "Servera kļūda",
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
                    <col width="190px" />
                    <col width="140px" />
                    <col width="140px" />
                    <col width="120px" />
                    <col width="120px" />
                    <col width="80px" />
                    <col width="100px" />
                    <col width="100px" />
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
                        <th className="p-2 text-left font-normal border-r">CPU laiks</th>
                        <th className="p-2 text-left font-normal border-r">Atmiņa</th>
                        <th className="p-2 text-left font-normal border-r">Statuss</th>
                        <th className="p-2 text-left font-normal">Iesūtījums</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <tr key={i} className={cn(" h-[76px]",{ "border-b border-divider": i !== 29 }, { "bg-gray-50": i % 2 === 0 })}>
                            <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                            <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                            <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                            <td className="p-2.5 py-2.5 animate-pulse border-r"><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
                            <td className="p-2.5 py-2.5 animate-pulse border-r" colSpan={2}><div className="bg-gray-300 rounded-sm w-full h-full text-gray-300">.</div></td>
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
                <col width="190px" />
                <col width="140px" />
                <col width="140px" />
                <col width="120px" />
                <col width="120px" />
                <col width="80px" />
                <col width="100px" />
                <col width="100px" />
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
                    <th className="p-2 text-left font-normal border-r">CPU laiks [s]</th>
                    <th className="p-2 text-left font-normal border-r">Atmiņa [MiB]</th>
                    <th className="p-2 text-left font-normal border-r">Statuss</th>
                    <th className="p-2 text-left font-normal">Iesūtījums</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((subm, i) => (
                    <tr key={subm.subm_uuid} className={cn("h-[76px]",{ "border-b border-divider": i !== submissions.length - 1 }, { "bg-gray-50": i % 2 === 0 })}>
                        <td className="p-2 py-2.5 border-r"><SubmTableDateTimeCell dateTime={subm.created_at} /></td>
                        <td className="p-2 py-2.5 border-r"><TextLink href={`/users/${subm.username}`}>{subm.username}</TextLink></td>
                        <td className="p-2 py-2.5 border-r">
                            <TextLink href={`/tasks/${subm.task_id}`}>
                                {subm.task_name}
                            </TextLink>
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
                                <span>{subm.score_info.received}</span>
                                <span>/</span>
                                <span>{subm.score_info.possible}</span>
                            </div>
                        </td>
                        <td className="p-2 py-2.5 border-r">{subm.score_info.exceeded_cpu ? <span>&gt; {subm.score_info.max_cpu_ms / 1000}</span> : <span>{(subm.score_info.max_cpu_ms / 1000).toFixed(2)}</span>}</td>
                        <td className="p-2 py-2.5 border-r">{subm.score_info.exceeded_mem ? <span>&gt; {subm.score_info.max_mem_kib / 1024}</span> : <span>{(subm.score_info.max_mem_kib / 1024).toFixed(1)}</span>}</td>
                        {/* <td className="p-2 py-2.5 border-r">{subm.curr_eval ? (errorTranslations[subm.curr_eval.eval_error] ?? statusTranslations[subm.curr_eval.eval_stage]) ?? ( subm.curr_eval.eval_error ? subm.curr_eval.eval_error : subm.curr_eval.eval_stage) : "..."}</td> */}
                        <td className="p-2 py-2.5 border-r">{statusTranslations[subm.status] ?? subm.status}</td>
                        <td className="p-2 py-2.5">
                            <TextLink href={`/submissions/${subm.subm_uuid}`}>
                                {subm.subm_uuid.slice(0, 8)}
                            </TextLink>
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