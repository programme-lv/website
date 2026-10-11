"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { IconChevronDown } from "@tabler/icons-react";
import TestDetailsModal, { full_verdicts, verdict_colors } from "@/components/test-details-modal";
import { TestRes } from "@/types/exec";
import GenericTable, { Column } from "@/components/generic-table";
import { renderMdLite } from "@/lib/render-md";
import "katex/dist/katex.min.css";
import { SubmEval } from "@/types/subm";
import { cn } from "./cn";

type TestGroupDetailsProps = {
    label?: string;
    groupNumber?: number;
    tests: TestRes[];
    points: number | null;
    scoreUnit: string;
    verdicts: string;
    columns: Column<TestRes>[];
    cpuLimitMs?: number;
    memLimitKiB?: number;
};

function maxOf<T>(items: T[], pick: (item: T) => number | null | undefined): number | null {
    const values = items.map(pick).filter((v): v is number => v != null);
    return values.length > 0 ? Math.max(...values) : null;
}

// Colours mirror the score bar: teal = full, amber = partial, red = none.
const fullScoreClass = "text-[#2c7a7b]";
const partialScoreClass = "text-[#d69e2e]";
const zeroScoreClass = "text-[#c53030]";

function scoreClass(earned: number, total: number): string {
    if (total > 0 && earned === total) return fullScoreClass;
    if (earned > 0) return partialScoreClass;
    return zeroScoreClass;
}

// Over-limit is red; otherwise the value is dark and the unit stays muted.
function limitTones(value: number | null, limit: number | undefined) {
    const over = value != null && limit != null && limit > 0 && value > limit;
    return {
        value: over ? "text-[#c53030]" : value == null ? "text-default-500" : "text-default-700",
        unit: over ? "text-[#c53030]" : "text-default-500",
    };
}

/**
 * One collapsible test group. The summary (always visible) shows the group
 * score and the maximum CPU/RAM over its tests; expanding reveals the tests.
 */
function TestGroupDetails({ label, groupNumber, tests, points, scoreUnit, verdicts, columns, cpuLimitMs, memLimitKiB }: TestGroupDetailsProps) {
    const acceptedCount = tests.filter(t => verdicts[t.id - 1] === "A").length;
    const isFull = tests.length > 0 && acceptedCount === tests.length;
    const earned = points == null ? null : scoreUnit === "test" ? acceptedCount : isFull ? points : 0;
    const total = points == null ? null : scoreUnit === "test" ? tests.length : points;
    const maxCpuMs = maxOf(tests, t => t.subm_rd?.cpu_ms);
    const maxMemKiB = maxOf(tests, t => t.subm_rd?.mem_kib);
    const scoreText = earned != null && total != null ? `${earned} / ${total}` : null;
    const scoreToneClass = earned != null && total != null ? scoreClass(earned, total) : "text-default-500";
    const cpuTones = limitTones(maxCpuMs, cpuLimitMs);
    const memTones = limitTones(maxMemKiB, memLimitKiB);

    return (
        <details className="group rounded-sm border-small border-divider">
            <summary className="flex cursor-pointer select-none items-center gap-x-4 px-3 py-2 text-sm hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                <span className="flex w-20 shrink-0 items-baseline">
                    {groupNumber != null ? (
                        <>
                            <span className="w-5 shrink-0 text-right font-medium tabular-nums">{groupNumber}.</span>
                            <span className="text-default-500">&nbsp;grupa</span>
                        </>
                    ) : (
                        <span className="font-medium">{label ?? ""}</span>
                    )}
                </span>
                <span className={cn("w-16 shrink-0 tabular-nums font-medium", scoreToneClass)}>
                    {scoreText ?? ""}
                </span>
                <span className="w-16 shrink-0 tabular-nums">
                    {maxCpuMs == null ? (
                        <span className={cpuTones.value}>—</span>
                    ) : (
                        <>
                            <span className={cpuTones.value}>{(maxCpuMs / 1000).toFixed(3)}</span>
                            <span className={cpuTones.unit}> s</span>
                        </>
                    )}
                </span>
                <span className="w-20 shrink-0 tabular-nums">
                    {maxMemKiB == null ? (
                        <span className={memTones.value}>—</span>
                    ) : (
                        <>
                            <span className={memTones.value}>{(maxMemKiB / 1024).toFixed(2)}</span>
                            <span className={memTones.unit}> MiB</span>
                        </>
                    )}
                </span>
                <IconChevronDown size={16} aria-hidden className="ml-auto shrink-0 text-default-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-divider px-2 py-2">
                <GenericTable
                    data={tests}
                    columns={columns}
                    keyExtractor={(test) => `${groupNumber ?? label ?? ""}_${test.id.toString()}`}
                    className="w-full max-w-[650px]"
                    rowHeight="compact"
                />
            </div>
        </details>
    );
}

export default function TestResultTable({ visible_details, subm_eval, test_results, limits }: {
    visible_details: boolean;
    subm_eval: SubmEval;
    test_results: TestRes[];
    limits?: { cpu_ms: number; mem_kib: number };
}) {
    const [selectedTest, setSelectedTest] = useState<TestRes | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openTestDetails = (test: TestRes) => {
        setSelectedTest(test);
        setIsOpen(true);
    };

    // set testgroup ids to be 1-indexed
    const testgroups = subm_eval.test_groups.map((tg, idx) => ({ ...tg, id: idx + 1 }));

    // returna list of testgroups that contain the test
    function test_testgroups(test: TestRes) {
        return testgroups.filter(tg => tg.tg_tests.some(x => x[0] <= test.id && x[1] >= test.id));
    }

    const tests_of_group = (tg: { tg_tests: [number, number][] }) =>
        test_results.filter(test => tg.tg_tests.some(x => x[0] <= test.id && x[1] >= test.id));

    const isIgnored = (test: TestRes) =>
        test.ign || subm_eval.verdicts[test.id - 1] === "I";

    let columns: Column<typeof test_results[0]>[] = [
        {
            key: "id",
            header: "Tests #",
            width: "60px",
            render: (test) => test.id
        },
        {
            key: "test_group",
            header: "Grupa",
            width: "60px",
            render: (test) => {
                const tgs = test_testgroups(test);
                return tgs.map(x => `${x.id}.`).join(", ");
            }
        },
        {
            key: "verdict",
            header: "Vērtējums",
            width: "170px",
            render: (test) => (
                <span className={`whitespace-nowrap ${verdict_colors[subm_eval.verdicts[test.id - 1]] || ''}`}>
                    {full_verdicts[subm_eval.verdicts[test.id - 1]] || 'Nezināms'}
                </span>
            )
        },
        {
            key: "cpu",
            header: "CPU laiks [s]",
            width: "110px",
            render: (test) => isIgnored(test)
                ? "—"
                : test.subm_rd?.cpu_ms ? (test.subm_rd.cpu_ms / 1000).toFixed(3) : "N/A"
        },
        {
            key: "mem",
            header: "Atmiņa [MiB]",
            width: "120px",
            render: (test) => isIgnored(test)
                ? "—"
                : test.subm_rd?.mem_kib ? (test.subm_rd.mem_kib / 1024).toFixed(2) : "N/A"
        },
        {
            key: "details",
            header: "Detaļas",
            width: "100px",
            render: (test) => isIgnored(test) ? null : (
                <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => openTestDetails(test)}
                    aria-label="Atvērt testa detaļas"
                    className="min-w-0 p-1 h-auto"
                >
                    <span className="text-default-500">[skatīt]</span>
                </Button>
            )
        }
    ];

    if(!visible_details){
        columns = columns.filter(x => x.key !== "details");
    }

    // return a list of indices where the testgroup changes in a list of subtask tests
    // used for visual separation of testgroups in the table
    function indices_where_testgroup_changes(test_results: TestRes[]) {
        const result = [];
        for (let i = 1; i < test_results.length; i++) {
            const prev_tg_ids = test_testgroups(test_results[i - 1]).map(tg => tg.id);
            const curr_tg_ids = test_testgroups(test_results[i]).map(tg => tg.id);
            if (prev_tg_ids.join(',') !== curr_tg_ids.join(',')) result.push(i - 1);
        }
        return result;
    }

    const hasGroups = testgroups.length > 0;
    const uncoveredTests = test_results.filter(test => !testgroups.some(tg => tests_of_group(tg).some(t => t.id === test.id)));

    const groupColumns = columns.filter(x => x.key !== "test_group");

    const renderGroup = (tg: typeof testgroups[number]) => (
        <TestGroupDetails
            key={tg.id}
            groupNumber={tg.id}
            tests={tests_of_group(tg)}
            points={tg.points}
            scoreUnit={subm_eval.score_unit}
            verdicts={subm_eval.verdicts}
            columns={groupColumns}
            cpuLimitMs={limits?.cpu_ms}
            memLimitKiB={limits?.mem_kib}
        />
    );

    const renderUncoveredTests = () => uncoveredTests.length > 0 ? (
        <TestGroupDetails
            key="uncovered"
            label="Citi testi"
            tests={uncoveredTests}
            points={null}
            scoreUnit={subm_eval.score_unit}
            verdicts={subm_eval.verdicts}
            columns={groupColumns}
            cpuLimitMs={limits?.cpu_ms}
            memLimitKiB={limits?.mem_kib}
        />
    ) : null;

    return (
        <div>
            {hasGroups ? (
                subm_eval.subtasks.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {subm_eval.subtasks.map((subtask, i) => (
                            <div key={subtask.description}>
                                <p className="text-sm pl-1 mt-2 mb-1">
                                    <span className="text-default-900">{i + 1}.</span>{" "}<span className="text-default-600">apakšuzdevums:</span>{" "}<span className="font-medium text-default-foreground" dangerouslySetInnerHTML={{ __html: renderMdLite(subtask.description).replaceAll("<p>", "").replaceAll("</p>", "") }} />
                                </p>
                                <div className="flex flex-col gap-2">
                                    {testgroups.filter(tg => tg.subtasks.includes(i + 1)).map(renderGroup)}
                                </div>
                            </div>
                        ))}
                        <div className="flex flex-col gap-2">
                            {testgroups.filter(tg => tg.subtasks.length === 0).map(renderGroup)}
                            {renderUncoveredTests()}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {testgroups.map(renderGroup)}
                        {renderUncoveredTests()}
                    </div>
                )
            ) : (
                <>
            {subm_eval.subtasks.length == 0 && <GenericTable
                data={test_results}
                columns={columns.filter(x => x.key !== "test_group")}
                keyExtractor={(test) => test.id.toString()}
                className="w-full max-w-[650px]"
                rowHeight="compact"
            />}

            <div className="flex flex-col gap-4">
                {subm_eval.subtasks.map((subtask, i) => (
                    <div key={subtask.description}>
                        <p className="text-sm pl-1 mt-2 mb-1">
                            <span className="text-default-900">{i + 1}.</span>{" "}<span className="text-default-600">apakšuzdevums:</span>{" "}<span className="font-medium text-default-foreground" dangerouslySetInnerHTML={{ __html: renderMdLite(subtask.description).replaceAll("<p>", "").replaceAll("</p>", "") }} />
                        </p>
                        <GenericTable
                            data={test_results.filter(test => subtask.st_tests.some(x => x[0] <= test.id && x[1] >= test.id))}
                            columns={columns}
                            keyExtractor={(test) => subtask.description + "_" + test.id.toString()}
                            className="w-full max-w-[650px]"
                            rowHeight="compact"
                            delimitedRows={indices_where_testgroup_changes(test_results.filter(test => subtask.st_tests.some(x => x[0] <= test.id && x[1] >= test.id)))}
                        />
                    </div>
                ))}
            </div>
                </>
            )}

            <TestDetailsModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                test={selectedTest}
                subm_eval={subm_eval}
            />
        </div>
    );
}