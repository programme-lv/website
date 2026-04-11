import { SubmListScoreBar } from "./subm-table-score-bars";
import { SubmListEntry } from "@/types/subm";
import { TextLink } from "./text-link";
import GenericTable, { Column } from "./generic-table";
import { DateTimeCell } from "./datetime-cell";
import { cn } from "./cn";

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

const narrowOnlyColsClass = "hidden xl:table-cell";
const narrowOnlyColgroupClass = "hidden xl:table-column";

type SubmissionTableProps = {
    submissions: SubmListEntry[];
    skeleton?: boolean;
}

function formatCpu(item: SubmListEntry) {
    return item.score_info.exceeded_cpu
        ? `> ${item.score_info.max_cpu_ms / 1000}`
        : (item.score_info.max_cpu_ms / 1000).toFixed(3);
}

function formatMem(item: SubmListEntry) {
    return item.score_info.exceeded_mem
        ? `> ${item.score_info.max_mem_kib / 1024}`
        : (item.score_info.max_mem_kib / 1024).toFixed(2);
}

function SubmissionEntryCard({ item }: { item: SubmListEntry }) {
    return (
        <article
            className={cn(
                "rounded-sm border-small border-divider bg-white px-5 py-3 flex flex-col gap-2 text-sm"
            )}
        >
            <div className="flex flex-wrap items-start justify-between gap-2">
                <DateTimeCell dateTime={item.created_at} showTime={true} />
                <span className="shrink-0 font-mono text-xs">
                    <TextLink
                        isDisabled={item.status !== "finished" && item.status !== "compile_error"}
                        href={`/submissions/${item.subm_uuid}`}
                    >
                        {item.subm_uuid.slice(0, 8)}
                    </TextLink>
                </span>
            </div>
            <div className="flex flex-col gap-1 text-default-800">
                <div>
                    <span className="text-default-500">Autors: </span>
                    <TextLink href={`/users/${item.username}`}>{item.username}</TextLink>
                </div>
                <div>
                    <span className="text-default-500">Uzdevums: </span>
                    <TextLink href={`/tasks/${item.task_id}`}>{item.task_name}</TextLink>
                </div>
                <div>
                    <span className="text-default-500">Valoda: </span>
                    {item.pr_lang_name}
                </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <div className="min-w-0 flex-1 basis-[10rem]">
                    <SubmListScoreBar
                        green={item.score_info.score_bar.green}
                        red={item.score_info.score_bar.red}
                        gray={item.score_info.score_bar.gray}
                        yellow={item.score_info.score_bar.yellow}
                        purple={item.score_info.score_bar.purple}
                    />
                </div>
                <span className="shrink-0 tabular-nums text-default-700">
                    {item.score_info.received} / {item.score_info.possible}
                </span>
            </div>
            <p className="text-xs text-default-500">
                CPU {formatCpu(item)} s · Atmiņa {formatMem(item)} MiB ·{" "}
                {statusTranslations[item.status] ?? item.status}
            </p>
        </article>
    );
}

function SubmissionCardsSkeleton({ rowCount }: { rowCount: number }) {
    return (
        <div className="flex flex-col gap-4 md:hidden" aria-hidden="true">
            {Array.from({ length: rowCount }).map((_, i) => (
                <div
                    key={`card-sk-${i}`}
                    className="animate-pulse rounded-sm border-small border-divider bg-white px-5 py-3"
                >
                    <div className="mb-3 flex justify-between gap-2">
                        <div className="h-4 w-36 rounded-sm bg-gray-300" />
                        <div className="h-4 w-16 rounded-sm bg-gray-300" />
                    </div>
                    <div className="mb-2 h-3 w-3/4 max-w-xs rounded-sm bg-gray-300" />
                    <div className="mb-2 h-3 w-2/3 max-w-xs rounded-sm bg-gray-300" />
                    <div className="mb-3 h-3 w-24 rounded-sm bg-gray-300" />
                    <div className="mb-2 h-5 w-full max-w-md rounded-sm bg-gray-300" />
                    <div className="h-3 w-48 rounded-sm bg-gray-300" />
                </div>
            ))}
        </div>
    );
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
            columnClassName: narrowOnlyColsClass,
            colgroupClassName: narrowOnlyColgroupClass,
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
            columnClassName: narrowOnlyColsClass,
            colgroupClassName: narrowOnlyColgroupClass,
            render: (item) => (
                item.score_info.exceeded_mem ? 
                <span>&gt; {item.score_info.max_mem_kib / 1024}</span> : 
                <span>{(item.score_info.max_mem_kib / 1024).toFixed(2)}</span>
            )
        },
        {
            key: "status",
            header: "Statuss",
            width: "120px",
            columnClassName: narrowOnlyColsClass,
            colgroupClassName: narrowOnlyColgroupClass,
            render: (item) => statusTranslations[item.status] ?? item.status
        },
        {
            key: "subm_uuid",
            header: "Iesūtījums",
            width: "120px",
            render: (item) => (
                <TextLink isDisabled={item.status !== "finished" && item.status !== "compile_error"} href={`/submissions/${item.subm_uuid}`}>
                    {item.subm_uuid.slice(0, 8)}
                </TextLink>
            )
        }
    ];

    const cardSkeletonRows = Math.min(12, 30);

    return (
        <>
            {skeleton ? (
                <SubmissionCardsSkeleton rowCount={cardSkeletonRows} />
            ) : (
                <div className="flex flex-col gap-4 md:hidden" role="list">
                    {submissions.map((item) => (
                        <SubmissionEntryCard key={item.subm_uuid} item={item} />
                    ))}
                </div>
            )}
            <div className="hidden md:block w-full min-w-0 overflow-x-auto">
                <GenericTable
                    data={submissions}
                    columns={columns}
                    keyExtractor={(item) => item.subm_uuid}
                    skeleton={skeleton}
                    skeletonRowCount={30}
                    className="w-full"
                />
            </div>
        </>
    );
}
