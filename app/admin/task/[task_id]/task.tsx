"use client";

import { useState, useRef } from "react";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { TextLink } from "@/components/text-link";
import { uploadTaskIllustration, deleteTaskIllustration } from "@/lib/task/upload-image";

interface TaskEditFormProps {
    task: Task;
}

export default function TaskEditForm({ task }: TaskEditFormProps) {
    const router = useRouter();
    const [isUploadingIllustration, setIsUploadingIllustration] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const illustrationFileInputRef = useRef<HTMLInputElement>(null);

    const handleIllustrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        try {
            setIsUploadingIllustration(true);
            setError(null);

            const response = await uploadTaskIllustration(task.short_task_id, file);
            if (response.status !== "success") {
                setError("Failed to upload illustration: " + response.message);
                return;
            }

            if (illustrationFileInputRef.current) {
                illustrationFileInputRef.current.value = "";
            }

            // Refresh the page to show the updated task data
            router.refresh();
            alert("Illustration uploaded successfully!");
        } catch (err) {
            console.error("Error uploading illustration:", err);
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setIsUploadingIllustration(false);
        }
    };

    const handleDeleteIllustration = async () => {
        if (!task.illustration_img) return;
        
        if (!confirm("Are you sure you want to delete the task illustration?")) {
            return;
        }

        try {
            setIsUploadingIllustration(true);
            setError(null);

            const response = await deleteTaskIllustration(task.short_task_id);
            if (response.status !== "success") {
                setError("Failed to delete illustration: " + response.message);
                return;
            }

            // Refresh the page to show the updated task data
            router.refresh();
            alert("Illustration deleted successfully!");
        } catch (err) {
            console.error("Error deleting illustration:", err);
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setIsUploadingIllustration(false);
        }
    };

    return (
        <div className="container py-2 mt-2 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">
                {task.task_full_name}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}


            {/* Task Metadata */}
            <div className="space-y-4 bg-white p-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Uzdevuma nosaukums</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.task_full_name}
                        disabled
                        title="Task name editing not yet implemented"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Izcelsmes olimpiāde</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.origin_olympiad}
                        disabled
                        title="Origin olympiad editing not yet implemented"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Grūtības pakāpe</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.difficulty_rating}
                        disabled
                        title="Difficulty rating editing not yet implemented"
                    />
                </div>
            </div>

            <h2 className="text-lg font-bold mt-4">Uzdevuma ilustrācija</h2>

            {/* Current Illustration */}
            {task.illustration_img && (
                <div className="mt-2">
                    <div className="flex items-start gap-4">
                        <img 
                            src={task.illustration_img.http_url} 
                            alt={task.task_full_name}
                            className="w-32 h-32 object-cover rounded-md border"
                        />
                        <div className="flex flex-col gap-2">
                            <TextLink 
                                href={task.illustration_img.http_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                View full size
                            </TextLink>
                            <div className="text-sm text-gray-600">
                                <div>Dimensions: {task.illustration_img.width_px} × {task.illustration_img.height_px} px</div>
                                <div>File size: {(task.illustration_img.sz_in_bytes / 1024).toFixed(1)} KB</div>
                            </div>
                            <button
                                className="p-2 px-3 text-sm bg-red-700 text-white rounded hover:bg-red-800 w-fit"
                                onClick={handleDeleteIllustration}
                                disabled={isUploadingIllustration}
                            >
                                {isUploadingIllustration ? "Deleting..." : "Delete Illustration"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload New Illustration */}
            {!task.illustration_img && <div className="mb-6">
                <div className="flex items-center">
                    <input
                        ref={illustrationFileInputRef}
                        type="file"
                        id="illustration-upload"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff"
                        onChange={handleIllustrationUpload}
                        className="hidden"
                    />
                    <label
                        htmlFor="illustration-upload"
                        className={`p-2 bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer ${isUploadingIllustration ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isUploadingIllustration ? "Uploading..." : "Choose Image"}
                    </label>
                </div>
            </div>}
        </div>
    );
}
