"use client";
import { useState, useEffect } from "react";
import { MarkdownStatement, Task } from "@/types/task";
import { updateTaskStatement, UpdateStatementRequest, deleteTaskImage, revalidateTask } from "@/lib/task/tasks";
import { useRouter } from "next/navigation";
import { TextLink } from "@/components/text-link";
import GenericTable from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import FileUpload from "@/components/file-upload";
import { uploadTaskImage } from "@/lib/task/upload-image";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface StatementEditFormProps {
    task: Task;
}

export default function StatementEditForm({ task }: StatementEditFormProps) {
    const router = useRouter();
    const [isSubmittingStatement, setIsSubmittingStatement] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
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

    const handleImageUpload = async (file: File) => {
        try {
            setIsUploadingImage(true);
            setUploadError(null);

            const response = await uploadTaskImage(task.short_task_id, file);
            if (response.status !== "success") {
                alert("Failed to upload image: " + response.message);
                return;
            }

            await router.refresh();

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
        <div className="container py-2 mt-2 max-w-4xl">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <h2 className="text-lg font-bold mb-1">Formulējums</h2>
            <div className="text-sm text-gray-600 mb-3">
                Padoms: Ctrl+S lai saglabāt formulējuma izmaiņas.
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Stāsts</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.story}
                        onChange={handleChange("story")}
                        rows={textareaRows.story}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ievaddati</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.input}
                        onChange={handleChange("input")}
                        rows={textareaRows.input}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Izvaddati</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.output}
                        onChange={handleChange("output")}
                        rows={textareaRows.output}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Piezīmes</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.notes}
                        onChange={handleChange("notes")}
                        rows={1}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Vērtēšana (šķiet, ka netiek izmantota)</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.scoring}
                        onChange={handleChange("scoring")}
                        rows={1}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Komunikācija  (interaktīvajos uzdevumos)</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.talk}
                        onChange={handleChange("talk")}
                        rows={1}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Piemērs (interaktīvajos uzdevumos)</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={formData.example}
                        onChange={handleChange("example")}
                        rows={1}
                    />
                </div>

                <div className="flex justify-end">
                    <GenericButton
                        variant="primary"
                        onClick={handleSave}
                        isLoading={isSubmittingStatement}
                        isDisabled={isSubmittingStatement}
                        icon={<IconDeviceFloppy size={18} />}
                    >
                        Saglabāt formulējumu
                    </GenericButton>
                </div>

                <h2 className="text-lg font-bold mb-4">Formulējuma attēli</h2>

                {uploadError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {uploadError}
                    </div>
                )}

                <div className="mb-4">
                    <div className="flex items-center">
                        <FileUpload
                            onFileSelect={handleImageUpload}
                            isLoading={isUploadingImage}
                            variant="primary"
                            acceptedTypes="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff"
                        >
                            Augšupielādēt jaunu attēlu
                        </FileUpload>
                        <span className="ml-2 text-sm text-gray-600">
                            Atļautie formāti: JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                        </span>
                    </div>
                </div>

                <div className="p-2 bg-white">
                    <GenericTable
                        data={task.statement_images || []}
                        columns={[
                            {
                                key: "preview",
                                header: "Priekšskatījums",
                                width: "100px",
                                render: (item) => (
                                    <img src={item.http_url} alt={item.filename} className="w-24" />
                                ),
                            },
                            {
                                key: "filename",
                                header: "Faila nosaukums",
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
                                        skatīt
                                    </TextLink>
                                ),
                            },
                            {
                                key: "width",
                                header: "Platums [px]",
                                render: (item) => item.width_px,
                                width: "120px",
                            },
                            {
                                key: "height",
                                header: "Augstums [px]",
                                render: (item) => item.height_px,
                                width: "120px",
                            },
                            {
                                key: "size",
                                header: "Izmērs [kB]",
                                render: (item) => (item.sz_in_bytes / 1000).toFixed(0),
                                width: "100px",
                            },
                            {
                                key: "delete",
                                header: "Darbība",
                                render: (item) => (
                                    <GenericButton
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteImage(item.filename)}
                                    >
                                        Dzēst
                                    </GenericButton>
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
