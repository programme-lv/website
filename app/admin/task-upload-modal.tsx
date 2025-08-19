"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconUpload, IconX } from "@tabler/icons-react";
import GenericButton from "@/components/generic-button";
import FileUpload from "@/components/file-upload";
import { uploadTask } from "@/lib/task/upload-task";
import { ApiResponse } from "@/lib/api-response";

interface TaskUploadModalProps {
  onTaskUploaded?: () => void;
}

export default function TaskUploadModal({ onTaskUploaded }: TaskUploadModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response: ApiResponse<any> = await uploadTask(selectedFile);
      
      if (response.status === "success") {
        setSuccess("Uzdevums veiksmīgi augšupielādēts!");
        setSelectedFile(null);
        if (onTaskUploaded) {
          onTaskUploaded();
        } else {
          // Ensure server-rendered admin page reflects new data
          router.refresh();
        }
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(response.message || "Kļūda augšupielādējot uzdevumu");
      }
    } catch (err: any) {
      setError(err.message || "Kļūda augšupielādējot uzdevumu");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
  };

  const isValidFile = selectedFile && selectedFile.name.toLowerCase().endsWith('.zip');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isUploading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, isUploading]);

  return (
    <>
      <GenericButton
        variant="success"
        size="md"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <IconUpload className="w-4 h-4" />
        Augšupielādēt uzdevumu
      </GenericButton>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Augšupielādēt uzdevumu</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                <IconX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Izvēlieties .zip failu, kas satur uzdevuma datus.
                </p>
                
                <FileUpload
                  onFileSelect={handleFileSelect}
                  acceptedTypes=".zip"
                  variant="default"
                  size="md"
                  className="w-full"
                  isLoading={isUploading}
                  isDisabled={isUploading}
                >
                  {selectedFile ? selectedFile.name : "Izvēlēties .zip failu"}
                </FileUpload>
              </div>

              {selectedFile && !isValidFile && (
                <div className="text-red-600 text-sm">
                  Lūdzu izvēlieties .zip failu.
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
                  {success}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <GenericButton
                  variant="default"
                  size="md"
                  onClick={handleClose}
                  className="flex-1"
                  isDisabled={isUploading}
                >
                  Atcelt
                </GenericButton>
                
                <GenericButton
                  variant="primary"
                  size="md"
                  onClick={handleUpload}
                  className="flex-1"
                  isDisabled={!isValidFile || isUploading}
                  isLoading={isUploading}
                >
                  Augšupielādēt
                </GenericButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
