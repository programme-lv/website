import { SubmListScoreBar } from "./subm-table-score-bars";
import { SubmListEntry } from "@/types/subm";
import { TextLink } from "@/components/ui/text-link";
import { formatScore } from "@/lib/format-score";
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
    const received = item.score_info.received_tenths ?? item.score_info.received * 10;
    const possible = item.score_info.possible_tenths ?? item.score_info.possible * 10;
    const isFullScore =
        isFinished &&
        possible > 0 &&
        received === possible;
    const text = isFinished
        ? formatScore(item.score_info.received, item.score_info.possible, item.score_info.received_tenths, item.score_info.possible_tenths)
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
            <DateTimeCell dateTime={item.created_at} showTime={true} />
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
                    <div className="flex flex-col gap-2">
                        {/* Datums + laiks sit next to each other, as in DateTimeCell. */}
                        <div className="flex gap-2">
                            <div className="h-4 w-[88px] rounded-sm bg-gray-300" />
                            <div className="h-4 w-16 rounded-sm bg-gray-300" />
                        </div>
                        {/* Autors / Uzdevums / Valoda lines. */}
                        <div className="flex flex-col gap-1">
                            <div className="h-4 w-24 rounded-sm bg-gray-300" />
                            <div className="h-4 w-48 max-w-[80%] rounded-sm bg-gray-300" />
                            <div className="h-4 w-28 rounded-sm bg-gray-300" />
                        </div>
                        {/* Score bar plus its result text. */}
                        <div className="flex items-center gap-x-3">
                            <div className="h-1.5 min-w-0 flex-1 basis-[10rem] rounded-sm bg-gray-300" />
                            <div className="h-4 w-14 shrink-0 rounded-sm bg-gray-300" />
                        </div>
                        <div className="h-3 w-48 rounded-sm bg-gray-300" />
                    </div>
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
            render: (item) => <DateTimeCell dateTime={item.created_at} showTime={true} />,
            // The real cell wraps date and time onto separate lines.
            renderSkeleton: () => (
                <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-[90px] rounded-sm bg-gray-300" />
                    <div className="h-4 w-[68px] rounded-sm bg-gray-300" />
                </div>
            )
        },
        {
            key: "username",
            header: "Autors",
            width: "140px",
            render: (item) => <TextLink href={`/users/${item.username}`}>{item.username}</TextLink>,
            renderSkeleton: () => <div className="h-4 w-14 rounded-sm bg-gray-300" />
        },
        {
            key: "task_name",
            header: "Uzdevums",
            width: "180px",
            render: (item) => <TextLink href={`/tasks/${item.task_id}`}>{item.task_name}</TextLink>,
            renderSkeleton: () => <div className="h-4 w-32 rounded-sm bg-gray-300" />
        },
        {
            key: "pr_lang_name",
            header: "Valoda",
            width: "120px",
            render: (item) => item.pr_lang_name,
            renderSkeleton: () => <div className="h-4 w-12 rounded-sm bg-gray-300" />
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
            ),
            renderSkeleton: () => <div className="h-4 w-11 rounded-sm bg-gray-300" />
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
            ),
            renderSkeleton: () => <div className="h-4 w-9 rounded-sm bg-gray-300" />
        },
        {
            key: "result_bar",
            header: "Rezultāts",
            width: "120px",
            headerColSpan: 2,
            render: (item) => <SubmissionScoreBarLink item={item} />,
            // The real score bar is a thin full-width line, not a text block.
            renderSkeleton: () => <div className="h-1.5 w-full rounded-sm bg-gray-300" />
        },
        {
            key: "result",
            header: "",
            width: "100px",
            render: (item) => <SubmissionResultText item={item} />,
            renderSkeleton: () => <div className="h-4 w-14 rounded-sm bg-gray-300" />
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
