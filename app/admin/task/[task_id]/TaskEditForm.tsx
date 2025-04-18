"use client";

import { useState, useRef } from "react";
import { MarkdownStatement, Task } from "@/types/task";
import { updateTaskStatement, UpdateStatementRequest, uploadTaskImage } from "@/lib/task/tasks";
import { useRouter } from "next/navigation";
import { TextLink } from "@/components/text-link";
import GenericTable from "@/components/generic-table";

interface TaskEditFormProps {
  task: Task;
}

export default function TaskEditForm({ task }: TaskEditFormProps) {
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

  const handleChange =
    (field: keyof Omit<MarkdownStatement, "images">) =>
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
          ...formData,
          [field]: e.target.value,
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

      await updateTaskStatement(task.published_task_id, data);

      // Refresh the page to show updated data
      router.refresh();

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
      
      const response = await uploadTaskImage(task.published_task_id, file);
      if(response.status !== "success") {
        alert("Failed to upload image: " + response.message);
        return;
      }

      router.refresh();

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

  return (
    <div className="container py-2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Edit Task: {task.task_full_name}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <h2 className="text-lg font-bold mb-4">Statement</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Story</label>
          <textarea
            className="w-full border rounded p-2 h-40"
            value={formData.story}
            onChange={handleChange("story")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Input</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.input}
            onChange={handleChange("input")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Output</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.output}
            onChange={handleChange("output")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.notes}
            onChange={handleChange("notes")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scoring</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.scoring}
            onChange={handleChange("scoring")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Talk</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.talk}
            onChange={handleChange("talk")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Example</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.example}
            onChange={handleChange("example")}
          />
        </div>

        <div className="flex justify-end">
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isSubmittingStatement ? "opacity-70 cursor-not-allowed" : ""}`}
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
              className={`p-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer ${isUploadingImage ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isUploadingImage ? "Uploading..." : "Upload New Image"}
            </label>
            <span className="ml-2 text-sm text-gray-600">
              Supported formats: JPG, PNG, GIF, WebP, SVG, BMP, TIFF
            </span>
          </div>
        </div>
        
        <div className="p-2 bg-white">
          <GenericTable
            data={task.statement_images || []}
            className="w-full"
            columns={[
              {
                key: "filename",
                header: "Filename",
                render: (item) => item.filename,
              },
              {
                key: "url",
                header: "URL",
                render: (item) => (
                  <TextLink
                    href={item.http_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    this
                  </TextLink>
                ),
              },
              {
                key: "width",
                header: "Width [px]",
                render: (item) => item.width_px,
              },
              {
                key: "height",
                header: "Height [px]",
                render: (item) => item.height_px,
              },
            ]}
            keyExtractor={(item) => item.http_url}
          />
        </div>
      </div>
    </div>
  );
}
