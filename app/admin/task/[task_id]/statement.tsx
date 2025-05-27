"use client";
import { useState, useRef, useEffect } from "react";
import { MarkdownStatement, Task } from "@/types/task";
import { updateTaskStatement, UpdateStatementRequest, deleteTaskImage, revalidateTask } from "@/lib/task/tasks";
import { useRouter } from "next/navigation";
import { TextLink } from "@/components/text-link";
import GenericTable from "@/components/generic-table";
import { uploadTaskImage } from "@/lib/task/upload-image";

interface StatementEditFormProps {
    task: Task;
}

export default function StatementEditForm({ task }: StatementEditFormProps) {
    const router = useRouter();
    const [isSubmittingStatement, setIsSubmittingStatement] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const task_md = task.default_md_statement;
    const [formData, setFormData] = useState<Partial<MarkdownStatement>>({
        story: task_md?.story || "",
        input: task_md?.input || "",
        output: task_md?.output || "",
        notes: task_md?.notes || "",
        scoring: task_md?.scoring || "",
        talk: task_md?.talk || "",
        example: task_md?.example || "",
    });

    const [textareaRows, setTextareaRows] = useState({
        story: calculateRows(task_md?.story || ""),
        input: calculateRows(task_md?.input || ""),
        output: calculateRows(task_md?.output || ""),
        notes: calculateRows(task_md?.notes || ""),
        scoring: calculateRows(task_md?.scoring || ""),
        talk: calculateRows(task_md?.talk || ""),
        example: calculateRows(task_md?.example || ""),
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [formData]);

    function calculateRows(text: string): number {
        const lineCount = (text.match(/\n/g) || []).length + 1;
        return Math.max(3, Math.min(40, lineCount));
    }

    const handleChange =
        (field: keyof Omit<MarkdownStatement, "images">) =>
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormData({
                    ...formData,
                    [field]: e.target.value,
                });
                setTextareaRows({
                    ...textareaRows,
                    [field]: calculateRows(e.target.value)
                });
            };

    const handleSave = async () => {
        try {
            setIsSubmittingStatement(true);
            setError(null);

            const data: UpdateStatementRequest = {
                story: formData.story || "",
                input: formData.input || "",
                output: formData.output || "",
                notes: formData.notes || "",
                scoring: formData.scoring || "",
                talk: formData.talk || "",
                example: formData.example || "",
            };

            await updateTaskStatement(task.short_task_id, data);
            revalidateTask(task.short_task_id);

            // Refresh the page to show updated data
            await router.refresh();

            alert("Task statement updated successfully!");
        } catch (err) {
            console.error("Error saving task statement:", err);
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setIsSubmittingStatement(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            setIsUploadingImage(true);
            setUploadError(null);

            const response = await uploadTaskImage(task.short_task_id, file);
            if (response.status !== "success") {
                alert("Failed to upload image: " + response.message);
                return;
            }

            await router.refresh();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            alert("Image uploaded successfully!");
        } catch (err) {
            console.error("Error uploading image:", err);
            setUploadError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleDeleteImage = async (filename: string) => {
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            setIsUploadingImage(true); // Reuse the loading state for deletion
            setUploadError(null);

            const response = await deleteTaskImage(task.short_task_id, filename);
            if (response.status !== "success") {
                alert("Failed to delete image: " + response.message);
                return;
            }

            await router.refresh();

            alert("Image deleted successfully!");
        } catch (err) {
            console.error("Error deleting image:", err);
            setUploadError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setIsUploadingImage(false);
        }
    }

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

            <h2 className="text-lg font-bold mb-1">Statement</h2>
            <div className="text-sm text-gray-600 mb-3">
                Pro tip: Press Ctrl+S to save the statement
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Story</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.story}
                        onChange={handleChange("story")}
                        rows={textareaRows.story}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Input</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.input}
                        onChange={handleChange("input")}
                        rows={textareaRows.input}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Output</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.output}
                        onChange={handleChange("output")}
                        rows={textareaRows.output}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.notes}
                        onChange={handleChange("notes")}
                        rows={textareaRows.notes}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Scoring</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.scoring}
                        onChange={handleChange("scoring")}
                        rows={textareaRows.scoring}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Talk</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.talk}
                        onChange={handleChange("talk")}
                        rows={textareaRows.talk}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Example</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.example}
                        onChange={handleChange("example")}
                        rows={textareaRows.example}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        className={`p-2 bg-blue-700 text-white rounded hover:bg-blue-800 ${isSubmittingStatement ? "opacity-70 cursor-not-allowed" : ""}`}
                        onClick={handleSave}
                        disabled={isSubmittingStatement}
                    >
                        {isSubmittingStatement ? "Saving..." : "Update statement"}
                    </button>
                </div>

                <h2 className="text-lg font-bold mb-4">Statement Images</h2>

                {uploadError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {uploadError}
                    </div>
                )}

                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="image-upload"
                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="image-upload"
                            className={`p-2 bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer ${isUploadingImage ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isUploadingImage ? "Uploading..." : "Upload New Image"}
                        </label>
                        <span className="ml-2 text-sm text-gray-600">
                            Supported formats: JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                        </span>
                    </div>
                </div>

                <div className="p-2 bg-white max-w-3xl">
                    <GenericTable
                        data={task.statement_images || []}
                        delimitedRows={[2, 5]}
                        columns={[
                            {
                                key: "preview",
                                header: "Preview",
                                width: "100px",
                                render: (item) => (
                                    <img src={item.http_url} alt={item.filename} className="w-24" />
                                ),
                            },
                            {
                                key: "filename",
                                header: "Filename",
                                render: (item) => item.filename,
                                width: "200px",
                            },
                            {
                                key: "url",
                                header: "URL",
                                width: "100px",
                                render: (item) => (
                                    <TextLink
                                        href={item.http_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        here
                                    </TextLink>
                                ),
                            },
                            {
                                key: "width",
                                header: "Width [px]",
                                render: (item) => item.width_px,
                                width: "100px",
                            },
                            {
                                key: "height",
                                header: "Height [px]",
                                render: (item) => item.height_px,
                                width: "100px",
                            },
                            {
                                key: "size",
                                header: "Size [kB]",
                                render: (item) => (item.sz_in_bytes / 1000).toFixed(0),
                                width: "100px",
                            },
                            {
                                key: "delete",
                                header: "Delete",
                                render: (item) => (
                                    <button className="p-2 px-3 text-sm bg-red-700 text-white rounded hover:bg-red-800" onClick={() => handleDeleteImage(item.filename)}>
                                        Delete
                                    </button>
                                ),
                                width: "100px",
                            }
                        ]}
                        keyExtractor={(item) => item.http_url}
                    />
                </div>
            </div>
        </div>
    );
}
