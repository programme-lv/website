"use client";
import React, { useState, useEffect } from "react";
import FileUpload from "@/components/file-upload";
import GenericButton from "@/components/generic-button";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";

interface CheckerEditModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    checkerCode: string;
    onSave: (code: string) => void;
}

export default function CheckerEditModal({ isOpen, onOpenChange, checkerCode, onSave }: CheckerEditModalProps) {
    const [code, setCode] = useState(checkerCode);
    const [isUploadingChecker, setIsUploadingChecker] = useState(false);

    const hasChanges = code !== checkerCode;

    // Sync internal state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCode(checkerCode);
        }
    }, [isOpen, checkerCode]);

    const handleSave = () => {
        onSave(code);
        onOpenChange();
    };

    const handleFileUpload = async (file: File) => {
        setIsUploadingChecker(true);

        try {
            const text = await file.text();
            setCode(text);
            setIsUploadingChecker(false);
        } catch {
            alert("Kļūda nolasot failu!");
            setIsUploadingChecker(false);
        }
    };

    const codeLines = code.split('\n').length;
    const codeLength = code.length;

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onOpenChange}>
            <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-md bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="border-b border-divider px-6 py-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">Čekeris</span>
                        <span className="text-sm text-default-600">
                            checker.cpp • C++ • Testlib.h • {codeLines} rindas • {codeLength} simboli
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-hidden p-6">
                    <div>
                        <FileUpload
                            acceptedTypes=".cpp,.cc,.c"
                            size="sm"
                            onFileSelect={handleFileUpload}
                            isDisabled={isUploadingChecker}
                            isLoading={isUploadingChecker}
                        >
                            {isUploadingChecker ? "Augšupielādē..." : "Augšupielādēt čekeri (.cpp)"}
                        </FileUpload>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full flex-1 p-2 border border-divider rounded-sm bg-white font-mono text-sm resize-none"
                        placeholder="Ievadiet čekera kodu..."
                    />
                </div>

                <div className="flex justify-end gap-3 border-t border-divider px-6 py-4">
                    <GenericButton
                        size="sm"
                        variant="secondary"
                        icon={<IconX size={16} />}
                        onClick={onOpenChange}
                    >
                        Atcelt
                    </GenericButton>
                    <GenericButton
                        size="sm"
                        variant="success"
                        icon={<IconDeviceFloppy size={16} />}
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        Saglabāt čekeri
                    </GenericButton>
                </div>
            </div>
        </div>
    );
} 