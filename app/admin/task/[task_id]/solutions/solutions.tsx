"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconPlayerPlay } from "@tabler/icons-react";

import GenericTable, { Column } from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { TextLink } from "@/components/ui/text-link";
import TextButton from "@/components/text-button";
import TaskCalibrationCard from "@/components/task-calibration-card";
import ProfileAutoRefresh from "@/components/profile-auto-refresh";
import { startAllSolutionProfiles, startSolutionProfile } from "@/lib/task/profiles";
import type { SolutionCalibration, SolutionSummary, TaskCalibration } from "@/types/profile";
import type { SubtaskOverview } from "@/types/task";

import EditSolutionModal from "./edit-solution-modal";
import ViewSolutionModal from "./view-solution-modal";

interface SolutionsEditFormProps {
    task_id: string;
    solutions: SolutionSummary[];
    calibration: TaskCalibration;
    allSubtasks: SubtaskOverview[];
    testsVersion: number;
}

export default function SolutionsEditForm({ task_id, solutions, calibration, allSubtasks, testsVersion }: SolutionsEditFormProps) {
    const router = useRouter();
    const calibrationByFname = new Map<string, SolutionCalibration>(
        calibration.solutions.map((solution) => [solution.fname, solution]),
    );
    const [isPending, startTransition] = useTransition();
    const [startingFname, setStartingFname] = useState<string | null>(null);
    const [isStartingAll, setIsStartingAll] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSolution, setSelectedSolution] = useState<SolutionSummary | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingSolution, setEditingSolution] = useState<SolutionSummary | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileFilter, setProfileFilter] = useState<"" | "stale" | "mismatched">("");

    const allRunning =
        solutions.length > 0 &&
        solutions.every((solution) => solution.latest_profile?.status === "running");

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

    const handleProfileAll = () => {
        setError(null);
        setNotice(null);
        setIsStartingAll(true);
        startTransition(async () => {
            try {
                const response = await startAllSolutionProfiles(task_id, 1, profileFilter);
                if (response.status !== "success") {
                    setError(response.message);
                    return;
                }
                const { started, skipped, filtered, failed } = response.data;
                let message = `Sākti profili: ${started}.`;
                if (skipped.length > 0) {
                    message += ` Jau notiek: ${skipped.length}.`;
                }
                if (filtered.length > 0) {
                    message += ` Atlasē neietilpst: ${filtered.length}.`;
                }
                if (failed.length > 0) {
                    message += ` Neizdevās: ${failed.length} (${failed.map((item) => item.fname).join(", ")}).`;
                }
                setNotice(message);
                router.refresh();
            } catch {
                setError("Neizdevās palaist profilēšanu visiem risinājumiem.");
            } finally {
                setIsStartingAll(false);
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
            render: (item) => {
                const binaryFullScore = item.subtasks.length === 0 && item.expected_points > 0;
                return (
                    <div className="flex flex-col">
                        <div>
                            {item.subtasks.length > 0
                                ? `${item.expected_points} p`
                                : binaryFullScore
                                  ? "AC"
                                  : "Nav norādīts"}
                        </div>
                        <div className="text-sm text-default-600">
                            {item.subtasks.length > 0
                                ? `Apakšuzdevumi: ${item.subtasks.join(", ")}`
                                : binaryFullScore
                                  ? `Jāatrisina visi testi (${item.expected_points} p)`
                                  : "Apakšuzdevumi nav norādīti"}
                        </div>
                    </div>
                );
            },
            width: "190px",
        },
        {
            key: "calibration",
            header: "Kalibrācija",
            render: (item) => {
                const cal = calibrationByFname.get(item.fname);
                const latest = item.latest_profile;
                if (!cal) {
                    return <div className="text-default-600">Nav datu</div>;
                }
                const profileId = cal.profile_id ?? latest?.id;
                const link = profileId ? (
                    <div>
                        [ <TextLink href={`/admin/task/${task_id}/solutions/profile/${profileId}`}>Skatīt profilu</TextLink> ]
                    </div>
                ) : null;

                if (cal.stale) {
                    return (
                        <div className="flex flex-col">
                            <div className="text-amber-800">Profils novecojis</div>
                            {link}
                        </div>
                    );
                }
                if (!cal.profile_id) {
                    if (latest?.status === "running") {
                        return (
                            <div className="flex flex-col">
                                <div className="text-amber-800">Notiek profilēšana…</div>
                                {link}
                            </div>
                        );
                    }
                    if (latest?.status === "finished") {
                        return (
                            <div className="flex flex-col">
                                <div className="text-default-600">
                                    Profils gatavs; sagaidāmais nav norādīts
                                </div>
                                {link}
                            </div>
                        );
                    }
                    return <div className="text-default-600">Nav profila</div>;
                }

                if (!cal.verdict.applicable) {
                    return (
                        <div className="flex flex-col">
                            <div className="text-default-600">Nav datu</div>
                            {link}
                        </div>
                    );
                }

                const missing = cal.verdict.subtasks
                    .filter((subtask) => subtask.declared && !subtask.fully_solved_all_runs)
                    .map((subtask) => subtask.subtask_id);
                const unintended = cal.verdict.subtasks
                    .filter((subtask) => !subtask.declared && subtask.fully_solved_any_run)
                    .map((subtask) => subtask.subtask_id);

                return (
                    <div className="flex flex-col gap-1">
                        {latest?.status === "running" && (
                            <div className="text-amber-800">Notiek jauns profils…</div>
                        )}
                        <div
                            className={
                                cal.verdict.matches
                                    ? "font-medium text-green-800"
                                    : "font-medium text-red-800"
                            }
                        >
                            {cal.verdict.matches ? "Atbilst" : "Neatbilst"}
                            <span className="ml-2 font-normal text-default-700">
                                {cal.verdict.score.median} / {cal.verdict.expected_points} p
                            </span>
                        </div>
                        {missing.length > 0 && (
                            <div className="text-xs text-red-800">Trūkst: {missing.join(", ")}</div>
                        )}
                        {unintended.length > 0 && (
                            <div className="text-xs text-red-800">Lieki: {unintended.join(", ")}</div>
                        )}
                        {cal.verdict.matches && cal.verdict.delta > 0 && (
                            <div className="text-xs text-amber-800">
                                +{cal.verdict.delta} p no daļējiem liekajiem
                            </div>
                        )}
                        {link}
                    </div>
                );
            },
            width: "220px",
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
                                disabled={isPending || isStartingAll || startingFname !== null || isRunning}
                            >
                                {isRunning || isStarting
                                    ? "Notiek…"
                                    : item.latest_profile
                                        ? "Pārprofilēt"
                                        : "Profilēt"}
                            </TextButton>{" "}
                            ]
                        </div>
                        <div>
                            [{" "}
                            <TextButton
                                variant="warning"
                                onClick={() => {
                                    setEditingSolution(item);
                                    setIsEditModalOpen(true);
                                }}
                            >
                                Rediģēt
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
            <ProfileAutoRefresh
                active={solutions.some((solution) => solution.latest_profile?.status === "running")}
            />
            <div>
                <h2 className="text-lg font-bold">Risinājumi</h2>
                <p className="text-sm max-w-[55em]">
                    Priekšlaicīgi sagatavoti pareizi un nepareizi risinājumi palīdz novērst nepilnības testkopā un vērtēšanas sistēmā,
                    kā arī izpildes ierobežojumos. Profilēšana izpilda risinājumu ar 10 s un 1 GiB limitu katram testam
                    un parāda, cik punktus tas iegūtu pie citiem limitiem.
                </p>
            </div>

            <TaskCalibrationCard taskId={task_id} calibration={calibration} />

            {error && (
                <div className="rounded-sm border border-red-300 bg-red-50 p-2 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <select
                    className="h-8 rounded-sm border border-divider bg-white px-2 text-sm"
                    value={profileFilter}
                    onChange={(event) =>
                        setProfileFilter(event.target.value as "" | "stale" | "mismatched")
                    }
                    aria-label="Profilējamo risinājumu atlase"
                >
                    <option value="">Visi risinājumi</option>
                    <option value="mismatched">Tikai neatbilstošie</option>
                    <option value="stale">Tikai novecojušie</option>
                </select>
                <GenericButton
                    size="sm"
                    icon={<IconPlayerPlay size={18} />}
                    onClick={handleProfileAll}
                    isLoading={isStartingAll}
                    isDisabled={
                        isPending ||
                        isStartingAll ||
                        startingFname !== null ||
                        solutions.length === 0 ||
                        allRunning
                    }
                >
                    {allRunning
                        ? "Visi jau notiek"
                        : profileFilter === ""
                          ? "Profilēt visus"
                          : "Profilēt atlasītos"}
                </GenericButton>
                <span className="text-xs text-default-600">1 mēģinājums katram</span>
                {notice && <span className="text-sm text-default-700">{notice}</span>}
            </div>

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

            <EditSolutionModal
                isOpen={isEditModalOpen}
                onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}
                taskId={task_id}
                solution={editingSolution}
                allSubtasks={allSubtasks}
            />
        </div>
    );
}
