"use client";

import { useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import TestDetailsModal, { full_verdicts, verdict_colors } from "@/components/test-details-modal";
import { Execution, TestRes } from "@/types/exec";
import { DetailedSubmView } from "@/types/subm";
import GenericTable, { Column } from "@/components/generic-table";
import { renderMdLite } from "@/lib/render-md";
import "katex/dist/katex.min.css";

export default function TestResultTable({ subm, exec }: { subm: DetailedSubmView, exec: Execution }) {
    const [selectedTest, setSelectedTest] = useState<TestRes | null>(null);
    const { isOpen, onOpen: openTestDetailsModal, onOpenChange } = useDisclosure();

    const openTestDetails = (test: TestRes) => {
        setSelectedTest(test);
        openTestDetailsModal();
    };

    // set testgroup ids to be 1-indexed
    const testgroups = subm.curr_eval.test_groups.map((tg, idx) => ({ ...tg, id: idx + 1 }));

    // set test ids to be 1-indexed
    const test_results = exec.test_res.map(x => ({ ...x }));

    // returna list of testgroups that contain the test
    function test_testgroups(test: TestRes) {
        return testgroups.filter(tg => tg.tg_tests.some(x => x[0] <= test.id && x[1] >= test.id));
    }

    let columns: Column<typeof test_results[0]>[] = [
        {
            key: "id",
            header: "Tests #",
            width: "80px",
            render: (test) => test.id
        },
        {
            key: "test_group",
            header: "Grupa",
            width: "110px",
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
                <span className={`whitespace-nowrap ${verdict_colors[subm.curr_eval.verdicts[test.id - 1]] || ''}`}>
                    {full_verdicts[subm.curr_eval.verdicts[test.id - 1]] || 'Nezināms'}
                </span>
            )
        },
        {
            key: "cpu",
            header: "CPU laiks [s]",
            width: "110px",
            render: (test) => test.subm_rd?.cpu_ms ? (test.subm_rd.cpu_ms / 1000).toFixed(3) : "N/A"
        },
        {
            key: "mem",
            header: "Atmiņa [MiB]",
            width: "120px",
            render: (test) => test.subm_rd?.mem_kib ? (test.subm_rd.mem_kib / 1024).toFixed(2) : "N/A"
        },
        {
            key: "details",
            header: "Detaļas",
            width: "100px",
            render: (test) => (
                <Button
                    variant="light"
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

    if(!subm.content){
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

    return (
        <div>
            <div>
                <GenericTable
                    data={test_results}
                    columns={columns.filter(x => x.key !== "test_group")}
                    keyExtractor={(test) => test.id.toString()}
                    className="w-full max-w-[650px]"
                    rowHeight="compact"
                />
            </div>

            <div className="flex flex-col gap-4">
                {subm.curr_eval.subtasks.map((subtask, i) => (
                    <div key={subtask.description}>
                        <p className="font-normal text-default-foreground pl-1 mt-2 mb-1">
                            {i + 1}. apakšuzdevums: <span dangerouslySetInnerHTML={{ __html: renderMdLite(subtask.description).replaceAll("<p>", "").replaceAll("</p>", "") }} />
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

            <TestDetailsModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                test={selectedTest}
                submission={subm}
            />
        </div>
    );
}