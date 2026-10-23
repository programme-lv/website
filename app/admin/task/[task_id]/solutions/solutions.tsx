"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import GenericTable, { Column } from "@/components/generic-table";
import { TextLink } from "@/components/ui/text-link";
import TextButton from "@/components/text-button";
import { startSolutionProfile } from "@/lib/task/profiles";
import type { SolutionSummary } from "@/types/profile";

import ViewSolutionModal from "./view-solution-modal";

interface SolutionsEditFormProps {
    task_id: string;
    solutions: SolutionSummary[];
    testsVersion: number;
}

export default function SolutionsEditForm({ task_id, solutions, testsVersion }: SolutionsEditFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [startingFname, setStartingFname] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSolution, setSelectedSolution] = useState<SolutionSummary | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const handleProfile = (solution: SolutionSummary) => {
        setError(null);
        setStartingFname(solution.fname);
        startTransition(async () => {
            try {
                const response = await startSolutionProfile(task_id, solution.fname);
                if (response.status !== "success") {
                    setError(response.message);
                    return;
                }
                router.push(`/admin/task/${task_id}/solutions/profile/${response.data.profile_id}`);
            } catch {
                setError("Neizdevās palaist profilēšanu. Pārbaudi, vai backend serveris ir pieejams.");
            } finally {
                setStartingFname(null);
            }
        });
    };

    const handleViewSolution = (solution: SolutionSummary) => {
        setSelectedSolution(solution);
        setIsViewModalOpen(true);
    };

    const columns: Column<SolutionSummary>[] = [
        {
            key: "filename",
            header: "Risinājums",
            render: (item) => (
                <div className="flex flex-col">
                    <div>{item.fname}</div>
                    <div className="flex flex-row gap-2">
                        [ <TextButton onClick={() => handleViewSolution(item)}>Skatīt</TextButton> ]
                        ( {item.lang_display || item.lang_id || "nezināma valoda"} )
                    </div>
                </div>
            ),
            width: "260px",
        },
        {
            key: "expected_result",
            header: "Sagaidāmais rezultāts",
            render: (item) => (
                <div className="flex flex-col">
                    <div>{item.subtasks.length > 0 ? `${item.expected_points} p` : "Nav norādīts"}</div>
                    <div className="text-sm text-default-600">
                        {item.subtasks.length > 0
                            ? `Apakšuzdevumi: ${item.subtasks.join(", ")}`
                            : "Apakšuzdevumi nav norādīti"}
                    </div>
                </div>
            ),
            width: "190px",
        },
        {
            key: "profile",
            header: "Profils",
            render: (item) => {
                const profile = item.latest_profile;
                if (!profile) {
                    return <div className="text-default-600">Nav profilēts</div>;
                }
                if (profile.status === "running") {
                    return <div>Notiek profilēšana…</div>;
                }
                if (profile.status === "failed") {
                    return (
                        <div className="flex flex-col">
                            <div className="text-red-700">Neizdevās</div>
                            <div>
                                [ <TextLink href={`/admin/task/${task_id}/solutions/profile/${profile.id}`}>Skatīt profilu</TextLink> ]
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="flex flex-col">
                        <div>Pabeigts</div>
                        <div>
                            [ <TextLink href={`/admin/task/${task_id}/solutions/profile/${profile.id}`}>Skatīt profilu</TextLink> ]
                        </div>
                    </div>
                );
            },
            width: "200px",
        },
        {
            key: "actions",
            header: "Darbības",
            render: (item) => {
                const isRunning = item.latest_profile?.status === "running";
                const isStarting = startingFname === item.fname;
                return (
                    <div className="flex flex-col">
                        <div>
                            [{" "}
                            <TextButton
                                onClick={() => handleProfile(item)}
                                disabled={isPending || isRunning || isStarting}
                            >
                                {isRunning || isStarting
                                    ? "Notiek…"
                                    : item.latest_profile
                                        ? "Pārprofilēt"
                                        : "Profilēt"}
                            </TextButton>{" "}
                            ]
                        </div>
                    </div>
                );
            },
            width: "150px",
        },
    ];

    return (
        <div className="container py-2 mt-2 flex flex-col gap-3 overflow-hidden">
            <div>
                <h2 className="text-lg font-bold">Risinājumi</h2>
                <p className="text-sm max-w-[55em]">
                    Priekšlaicīgi sagatavoti pareizi un nepareizi risinājumi palīdz novērst nepilnības testkopā un vērtēšanas sistēmā,
                    kā arī izpildes ierobežojumos. Profilēšana izpilda risinājumu ar 10 s un 1 GiB limitu katram testam
                    un parāda, cik punktus tas iegūtu pie citiem limitiem.
                </p>
            </div>

            {error && (
                <div className="rounded-sm border border-red-300 bg-red-50 p-2 text-sm text-red-800">
                    {error}
                </div>
            )}

            {solutions.length === 0 ? (
                <div className="rounded-sm border border-divider bg-white p-4 text-sm text-default-600">
                    Šim uzdevumam vēl nav saglabātu risinājumu. Tie tiek pievienoti kopā ar TaskZip arhīvu.
                </div>
            ) : (
                <div className="p-2 bg-white border border-divider rounded-sm w-max max-w-full overflow-x-scroll">
                    <GenericTable
                        data={solutions}
                        columns={columns}
                        keyExtractor={(item) => item.fname}
                    />
                </div>
            )}

            <div className="flex flex-col gap-1 text-sm text-default-600">
                <p>
                    Risinājumi tiek pievienoti, importējot TaskZip arhīvu. Profilēšana saglabā katru mēģinājumu
                    un ļauj atvērt izpildes rezultātus.
                </p>
                {testsVersion > 0 && (
                    <p>
                        Ja testi tiek mainīti, profili tiek atzīmēti kā novecojuši. Pašreizējā testu versija: {testsVersion}.
                    </p>
                )}
            </div>

            <ViewSolutionModal
                isOpen={isViewModalOpen}
                onOpenChange={() => setIsViewModalOpen(!isViewModalOpen)}
                filename={selectedSolution?.fname || ""}
                pr_lang={selectedSolution?.lang_display || selectedSolution?.lang_id || ""}
                expected_result={
                    selectedSolution
                        ? `${selectedSolution.expected_points} p`
                        : ""
                }
                content={selectedSolution?.content || ""}
            />
        </div>
    );
}
