"use client";
import { useState, useEffect } from "react";
import { MarkdownStatement, Task } from "@/types/task";
import { updateTaskStatement, UpdateStatementRequest, revalidateTask } from "@/lib/task/tasks";
import { useRouter } from "next/navigation";
import GenericButton from "@/components/generic-button";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface ScoringEditFormProps {
    task: Task;
}

export default function ScoringEditForm({ task }: ScoringEditFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const task_md = task.default_md_statement;
    const initialScoring = task_md?.scoring || "";
    
    const [scoring, setScoring] = useState<string>(initialScoring);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [scoring, initialScoring]);

    const handleSave = async () => {
        const hasChanges = scoring !== initialScoring;
        
        if (!hasChanges) {
            alert("Nav izmaiņu, ko saglabāt!");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const data: UpdateStatementRequest = {
                story: task_md?.story || "",
                input: task_md?.input || "",
                output: task_md?.output || "",
                notes: task_md?.notes || "",
                scoring: scoring,
                talk: task_md?.talk || "",
                example: task_md?.example || "",
            };

            await updateTaskStatement(task.short_task_id, data);
            revalidateTask(task.short_task_id);

            await router.refresh();
            alert("Vērtēšanas informācija ir saglabāta!");
        } catch (err) {
            console.error("Error saving scoring information:", err);
            setError(
                err instanceof Error ? err.message : "Radās nezināma kļūda"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasChanges = scoring !== initialScoring;

    return (
        <div className="container py-2 mt-2 max-w-4xl">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <h2 className="text-lg font-bold mb-1">Vērtēšana</h2>
            <div className="text-sm text-gray-600 mb-3">
                Ctrl+S, lai saglabātu izmaiņas.
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Vērtēšana</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={scoring}
                        onChange={(e) => setScoring(e.target.value)}
                        rows={10}
                        placeholder="Vērtēšanas informācija..."
                    />
                </div>

                <div className="flex justify-end">
                    <GenericButton
                        variant="success"
                        onClick={handleSave}
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting || !hasChanges}
                        icon={<IconDeviceFloppy size={18} />}
                    >
                        Saglabāt
                    </GenericButton>
                </div>
            </div>
        </div>
    );
} 