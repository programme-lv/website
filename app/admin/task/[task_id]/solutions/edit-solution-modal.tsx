"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import GenericButton from "@/components/generic-button";
import { updateTaskSolution } from "@/lib/task/tasks";
import type { SolutionSummary } from "@/types/profile";
import type { SubtaskOverview } from "@/types/task";

interface EditSolutionModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    taskId: string;
    solution: SolutionSummary | null;
    allSubtasks: SubtaskOverview[];
}

export default function EditSolutionModal({
    isOpen,
    onOpenChange,
    taskId,
    solution,
    allSubtasks,
}: EditSolutionModalProps) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [subtasks, setSubtasks] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!solution) {
            return;
        }
        setContent(solution.content);
        setSubtasks(solution.subtasks);
        setError(null);
    }, [solution]);

    if (!isOpen || !solution) {
        return null;
    }

    const toggleSubtask = (id: number) => {
        setSubtasks((previous) =>
            previous.includes(id)
                ? previous.filter((value) => value !== id)
                : [...previous, id].sort((a, b) => a - b),
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const response = await updateTaskSolution(taskId, solution.fname, content, subtasks);
            if (response.status !== "success") {
                setError(response.message);
                return;
            }
            onOpenChange();
            router.refresh();
        } catch {
            setError("Neizdevās saglabāt risinājumu.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onOpenChange}>
            <div
                className="flex max-h-[92vh] w-full max-w-6xl flex-col rounded-md bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="border-b border-divider px-6 py-3">
                    <div className="text-lg font-semibold">Rediģēt risinājumu</div>
                    <div className="text-sm text-default-600">
                        {solution.fname} · sagaidītie punkti tiek aprēķināti no atzīmētajiem apakšuzdevumiem
                    </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Sagaidāmie apakšuzdevumi</div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {allSubtasks.map((subtask) => (
                                <label
                                    key={subtask.subtask}
                                    className="flex items-start gap-2 rounded-sm border border-divider p-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={subtasks.includes(subtask.subtask)}
                                        onChange={() => toggleSubtask(subtask.subtask)}
                                    />
                                    <span>
                                        <span className="font-medium">
                                            Apakšuzdevums {subtask.subtask} · {subtask.score} p
                                        </span>
                                        {subtask.descriptions?.lv && (
                                            <span className="block text-default-600">
                                                {subtask.descriptions.lv}
                                            </span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">Risinājuma kods</div>
                        <textarea
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            spellCheck={false}
                            className="h-[42vh] w-full resize-none rounded-sm border border-divider bg-gray-50 p-3 font-mono text-sm"
                        />
                    </div>

                    {error && (
                        <div className="rounded-sm border border-red-300 bg-red-50 p-2 text-sm text-red-800">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-divider px-6 py-4">
                    <span className="text-xs text-default-600">
                        Saglabāšana neizpilda risinājumu; profils tiks atzīmēts kā novecojis.
                    </span>
                    <div className="flex gap-3">
                        <button
                            className="rounded-md border border-divider px-4 py-2 text-sm hover:bg-gray-50"
                            onClick={onOpenChange}
                            type="button"
                        >
                            Atcelt
                        </button>
                        <GenericButton
                            size="sm"
                            variant="success"
                            isLoading={saving}
                            onClick={handleSave}
                        >
                            Saglabāt
                        </GenericButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
