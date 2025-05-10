'use client'
import GenericTable from "@/components/generic-table";
import { listSubmissions, reevaluateSubmissions } from "@/lib/subms";
import { PaginatedSubmListResponse, SubmListEntry } from "@/types/subm";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NumberInput } from "@heroui/number-input";
import { Checkbox } from "@heroui/checkbox";
import { statusTranslations } from "@/components/submission-table";

export default function SubmAdminList({ submPage }: { submPage: PaginatedSubmListResponse }) {
    const [subms, setSubms] = useState<SubmListEntry[]>(submPage.page);
    const [limit, setLimit] = useState(submPage.pagination.limit);
    const [offset, setOffset] = useState(submPage.pagination.offset);
    const [currentPage, setCurrentPage] = useState(Math.floor(submPage.pagination.offset / submPage.pagination.limit) + 1);
    const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
    const [isReevaluating, setIsReevaluating] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["submissions", offset, limit],
        queryFn: () => listSubmissions(offset, limit),
        enabled: true,
    });

    useEffect(() => {
        if (data) setSubms(data.page);
    }, [data]);

    useEffect(() => {
        setOffset((currentPage - 1) * limit);
    }, [currentPage, limit]);

    const handleCheckboxChange = (submUuid: string, isChecked: boolean) => {
        setSelectedSubmissions(prev => {
            const newSelection = new Set(prev);
            if (isChecked) {
                newSelection.add(submUuid);
            } else {
                newSelection.delete(submUuid);
            }
            return newSelection;
        });
    };

    const handleReevaluate = async () => {
        if (selectedSubmissions.size === 0) return;

        setIsReevaluating(true);
        try {
            await reevaluateSubmissions(Array.from(selectedSubmissions));
            // Clear selection after successful reevaluation
            setSelectedSubmissions(new Set());
            // Optionally refresh the list
            refetch();
        } catch (error) {
            console.error("Failed to reevaluate submissions:", error);
        } finally {
            setIsReevaluating(false);
        }
    };

    return (
        <div className="p-2 bg-white  max-w-2xl rounded-small">
            {/* <button onClick={() => refetch()}>Refresh</button> */}
            <div className="flex flex-row gap-2 items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <NumberInput fullWidth={false} size="sm" value={currentPage} onValueChange={setCurrentPage} label="Page" min={1} />
                    <NumberInput fullWidth={false} size="sm" value={limit} onValueChange={setLimit} label="Limit" />
                    <Button color="primary" onPress={() => refetch()}>Refresh</Button>
                </div>
                <Button
                    color="secondary"
                    onPress={handleReevaluate}
                    isDisabled={selectedSubmissions.size === 0 || isReevaluating}
                > Reevaluate</Button>
            </div>
            <br />
            <GenericTable
                data={subms}
                columns={[
                    {
                        key: "select",
                        header: "Select",
                        width: "60px",
                        render: (subm) => (
                            <div className="flex justify-center items-center">
                                <Checkbox
                                    isSelected={selectedSubmissions.has(subm.subm_uuid)}
                                    onValueChange={(isChecked) => handleCheckboxChange(subm.subm_uuid, isChecked)}
                                />
                            </div>
                        )
                    },
                    {
                        key: "uuid",
                        header: "UUID",
                        render: (subm) => subm.subm_uuid.slice(0, 8)
                    },
                    {
                        key: "username",
                        header: "Lietotājs",
                        render: (subm) => subm.username
                    },
                    {
                        key: "score",
                        header: "Vērtējums",
                        render: (subm) => subm.score_info.received + "/" + subm.score_info.possible
                    },
                    {
                        key: "task_name",
                        header: "Uzdevums",
                        render: (subm) => subm.task_name
                    },
                    {
                        key: "status",
                        header: "Status",
                        render: (subm) => statusTranslations[subm.status as keyof typeof statusTranslations]
                    }
                ]}
                keyExtractor={(subm) => subm.subm_uuid}
                className="w-full"
            />
        </div>
    );
}
