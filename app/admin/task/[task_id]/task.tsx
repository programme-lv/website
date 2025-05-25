"use client";

import { useState, useRef } from "react";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { TextLink } from "@/components/text-link";

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

            // TODO: Implement API call for uploading illustration image
            // const response = await uploadTaskIllustration(task.short_task_id, file);
            // if (response.status !== "success") {
            //     alert("Failed to upload illustration: " + response.message);
            //     return;
            // }

            // For now, just show a placeholder message
            alert("Illustration image upload API not yet implemented");

            // await router.refresh();

            if (illustrationFileInputRef.current) {
                illustrationFileInputRef.current.value = "";
            }

            // alert("Illustration uploaded successfully!");
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
        if (!task.illustration_img_url) return;
        
        if (!confirm("Are you sure you want to delete the task illustration?")) {
            return;
        }

        try {
            setIsUploadingIllustration(true);
            setError(null);

            // TODO: Implement API call for deleting illustration image
            // const response = await deleteTaskIllustration(task.short_task_id);
            // if (response.status !== "success") {
            //     alert("Failed to delete illustration: " + response.message);
            //     return;
            // }

            // For now, just show a placeholder message
            alert("Delete illustration API not yet implemented");

            // await router.refresh();
            // alert("Illustration deleted successfully!");
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
        <div className="container py-2 mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                {task.task_full_name}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <h2 className="text-lg font-bold mb-4">Task Illustration</h2>
            <p className="text-sm text-gray-600 mb-4">
                This image is displayed on the task card in the task list.
            </p>

            {/* Current Illustration */}
            {task.illustration_img_url && (
                <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Current Illustration</h3>
                    <div className="flex items-start gap-4">
                        <img 
                            src={task.illustration_img_url} 
                            alt={task.task_full_name}
                            className="w-32 h-32 object-cover rounded-md border"
                        />
                        <div className="flex flex-col gap-2">
                            <TextLink 
                                href={task.illustration_img_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                View full size
                            </TextLink>
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
            <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">
                    {task.illustration_img_url ? "Replace Illustration" : "Upload Illustration"}
                </h3>
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
                    <span className="ml-2 text-sm text-gray-600">
                        Supported formats: JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 120x120 pixels. Images will be automatically resized if needed.
                </p>
            </div>

            {/* Task Metadata */}
            <h2 className="text-lg font-bold mb-4">Task Metadata</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Task Name</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.task_full_name}
                        disabled
                        title="Task name editing not yet implemented"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Origin Olympiad</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.origin_olympiad}
                        disabled
                        title="Origin olympiad editing not yet implemented"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Difficulty Rating</label>
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

                <div>
                    <label className="block text-sm font-medium mb-1">Memory Limit (MB)</label>
                    <input
                        type="number"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.memory_limit_megabytes}
                        disabled
                        title="Memory limit editing not yet implemented"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">CPU Time Limit (seconds)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="w-full border rounded p-2 bg-gray-50"
                        value={task.cpu_time_limit_seconds}
                        disabled
                        title="CPU time limit editing not yet implemented"
                    />
                </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Task metadata editing is not yet implemented. 
                    Currently, only illustration image upload/replacement is planned for implementation.
                </p>
            </div>
        </div>
    );
}
