import { SubmListScoreBar } from "./subm-table-score-bars";
import { SubmListEntry } from "@/types/subm";
import { TextLink } from "@/components/ui/text-link";
import GenericTable, { Column } from "./generic-table";
import { DateTimeCell } from "./datetime-cell";
import { cn } from "./cn";
import Link from "next/link";

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

const narrowOnlyColsClass = "hidden xl:table-cell";
const narrowOnlyColgroupClass = "hidden xl:table-column";

const errorStatuses = new Set([
    "error",
    "compile_error",
    "runtime_error",
    "checker_error",
    "internal_error",
]);

/**
 * "Rezultāts" is split across two cells (bar, then text) as before, but the
 * status is folded into the text cell and both cells link to the submission
 * detail page. The submission id lives in the hover title (id column removed).
 */
function SubmissionScoreBarLink({ item }: { item: SubmListEntry }) {
    return (
        <Link
            href={`/submissions/${item.id}`}
            title={`Iesūtījums #${item.id}`}
            aria-label={`Iesūtījums #${item.id}`}
            className="block w-full"
        >
            <SubmListScoreBar
                green={item.score_info.score_bar.green}
                red={item.score_info.score_bar.red}
                gray={item.score_info.score_bar.gray}
                yellow={item.score_info.score_bar.yellow}
                purple={item.score_info.score_bar.purple}
            />
        </Link>
    );
}

function SubmissionResultText({ item }: { item: SubmListEntry }) {
    const isFinished = item.status === "finished";
    const isError = errorStatuses.has(item.status);
    const isFullScore =
        isFinished &&
        item.score_info.possible > 0 &&
        item.score_info.received === item.score_info.possible;
    const text = isFinished
        ? `${item.score_info.received} / ${item.score_info.possible}`
        : isError
            ? "kļūda"
            : (statusTranslations[item.status] ?? item.status).toLowerCase();

    // Underline colour encodes the outcome; shades match the score bar.
    // Partial scores stay neutral (current text colour) — being wrong along
    // the way is normal, not an error state. 1px at rest, thicker on hover.
    const underline = isError
        ? "decoration-[#6B46C1] hover:decoration-2"
        : isFinished
            ? isFullScore
                ? "decoration-[#2c7a7b] hover:decoration-2"
                : "decoration-current hover:decoration-2"
            : "decoration-blue-800/30 hover:decoration-blue-800/90";

    return (
        <Link
            href={`/submissions/${item.id}`}
            title={`Iesūtījums #${item.id}`}
            className={cn(
                "underline underline-offset-2",
                underline,
                isError && "text-[#6B46C1]",
                isFinished && "tabular-nums text-default-700",
                !isFinished && !isError && "text-default-500",
            )}
        >
            {text}
        </Link>
    );
}

/**
 * Date/time is the second link to the submission (the result text is the
 * first). Kept in the default text colour with no resting underline so it
 * does not compete with the author/task/result links; underlines on hover.
 */
function SubmissionDateTimeLink({ item }: { item: SubmListEntry }) {
    return (
        <Link
            href={`/submissions/${item.id}`}
            title={`Iesūtījums #${item.id}`}
            className="underline underline-offset-2 decoration-current/30 hover:decoration-current/90"
        >
            <DateTimeCell dateTime={item.created_at} showTime={true} />
        </Link>
    );
}

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
            <SubmissionDateTimeLink item={item} />
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
            <div className="flex min-w-0 items-center gap-x-3 gap-y-1">
                <div className="min-w-0 flex-1 basis-[10rem]">
                    <SubmissionScoreBarLink item={item} />
                </div>
                <SubmissionResultText item={item} />
            </div>
            <p className="text-xs text-default-500">
                CPU {formatCpu(item)} s · Atmiņa {formatMem(item)} MiB
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
            header: "Datums, laiks",
            width: "120px",
            render: (item) => <SubmissionDateTimeLink item={item} />
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
            key: "result_bar",
            header: "Rezultāts",
            width: "120px",
            headerColSpan: 2,
            render: (item) => <SubmissionScoreBarLink item={item} />
        },
        {
            key: "result",
            header: "",
            width: "100px",
            render: (item) => <SubmissionResultText item={item} />
        },
        {
            key: "cpu_time",
            header: "CPU [s]",
            width: "80px",
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
            header: "RAM [MiB]",
            width: "100px",
            columnClassName: narrowOnlyColsClass,
            colgroupClassName: narrowOnlyColgroupClass,
            render: (item) => (
                item.score_info.exceeded_mem ? 
                <span>&gt; {item.score_info.max_mem_kib / 1024}</span> : 
                <span>{(item.score_info.max_mem_kib / 1024).toFixed(2)}</span>
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
