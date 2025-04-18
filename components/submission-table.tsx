import { SubmListScoreBar } from "./subm-table-score-bars";
import { SubmListEntry } from "@/types/subm";
import { TextLink } from "./text-link";
import GenericTable, { Column } from "./generic-table";
import { DateTimeCell } from "./datetime-cell";

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
    skeleton?: boolean;
}

export default function SubmissionTable({ submissions, skeleton = false }: SubmissionTableProps) {
    const columns: Column<SubmListEntry>[] = [
        {
            key: "created_at",
            header: "Datums & laiks",
            width: "190px",
            render: (item) => <DateTimeCell dateTime={item.created_at} showTime={true} />
        },
        {
            key: "username",
            header: "Autors",
            width: "140px",
            render: (item) => <TextLink href={`/users/${item.username}`}>{item.username}</TextLink>
        },
        {
            key: "task_name",
            header: "Uzdevums",
            width: "140px",
            render: (item) => <TextLink href={`/tasks/${item.task_id}`}>{item.task_name}</TextLink>
        },
        {
            key: "pr_lang_name",
            header: "Valoda",
            width: "120px",
            render: (item) => item.pr_lang_name
        },
        {
            key: "score_bar",
            header: "Rezultāts",
            width: "120px",
            headerColSpan: 2,
            render: (item) => (
                <SubmListScoreBar
                    green={item.score_info.score_bar.green}
                    red={item.score_info.score_bar.red}
                    gray={item.score_info.score_bar.gray}
                    yellow={item.score_info.score_bar.yellow}
                    purple={item.score_info.score_bar.purple}
                />
            )
        },
        {
            key: "score",
            header: "",
            width: "100px",
            render: (item) => (
                <div className="flex flex-wrap gap-x-1 gap-y-1 min-w-20">
                    <span>{item.score_info.received}</span>
                    <span>/</span>
                    <span>{item.score_info.possible}</span>
                </div>
            )
        },
        {
            key: "cpu_time",
            header: "CPU laiks [s]",
            width: "120px",
            render: (item) => (
                item.score_info.exceeded_cpu ? 
                <span>&gt; {item.score_info.max_cpu_ms / 1000}</span> : 
                <span>{(item.score_info.max_cpu_ms / 1000).toFixed(3)}</span>
            )
        },
        {
            key: "memory",
            header: "Atmiņa [MiB]",
            width: "120px",
            render: (item) => (
                item.score_info.exceeded_mem ? 
                <span>&gt; {item.score_info.max_mem_kib / 1024}</span> : 
                <span>{(item.score_info.max_mem_kib / 1024).toFixed(1)}</span>
            )
        },
        {
            key: "status",
            header: "Statuss",
            width: "120px",
            render: (item) => statusTranslations[item.status] ?? item.status
        },
        {
            key: "subm_uuid",
            header: "Iesūtījums",
            width: "120px",
            render: (item) => (
                <TextLink href={`/submissions/${item.subm_uuid}`}>
                    {item.subm_uuid.slice(0, 8)}
                </TextLink>
            )
        }
    ];

    return (
        <GenericTable
            data={submissions}
            columns={columns}
            keyExtractor={(item) => item.subm_uuid}
            skeleton={skeleton}
            skeletonRowCount={30}
            className="w-full"
        />
    );
}