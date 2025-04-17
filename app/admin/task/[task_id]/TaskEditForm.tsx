"use client";

import { useState } from "react";
import { MarkdownStatement } from "@/types/task";
import { updateTaskStatement, UpdateStatementRequest } from "@/lib/task/tasks";
import { useRouter } from "next/navigation";

interface TaskEditFormProps {
  task: any;
}

export default function TaskEditForm({ task }: TaskEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MarkdownStatement>>({
    story: task.default_md_statement.story || "",
    input: task.default_md_statement.input || "",
    output: task.default_md_statement.output || "",
    notes: task.default_md_statement.notes || "",
    scoring: task.default_md_statement.scoring || "",
    talk: task.default_md_statement.talk || "",
    example: task.default_md_statement.example || "",
  });

  const handleChange = (field: keyof Omit<MarkdownStatement, 'images'>) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
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
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Task: {task.task_full_name}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Story</label>
          <textarea 
            className="w-full border rounded p-2 h-40"
            value={formData.story}
            onChange={handleChange('story')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Input</label>
          <textarea 
            className="w-full border rounded p-2 h-24"
            value={formData.input}
            onChange={handleChange('input')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Output</label>
          <textarea 
            className="w-full border rounded p-2 h-24"
            value={formData.output}
            onChange={handleChange('output')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea 
            className="w-full border rounded p-2 h-24"
            value={formData.notes}
            onChange={handleChange('notes')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Scoring</label>
          <textarea 
            className="w-full border rounded p-2 h-24"
            value={formData.scoring}
            onChange={handleChange('scoring')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Talk</label>
          <textarea 
            className="w-full border rounded p-2 h-24"
            value={formData.talk}
            onChange={handleChange('talk')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Example</label>
          <textarea 
            className="w-full border rounded p-2 h-24"
            value={formData.example}
            onChange={handleChange('example')}
          />
        </div>
        
        <div>
          <button 
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 