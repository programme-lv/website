"use client";
import React from "react";

interface ViewSolutionModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    filename: string;
    pr_lang: string;
    author: string;
    expected_result: string;
    content: string;
}

export default function ViewSolutionModal({ isOpen, onOpenChange, filename, pr_lang, author, expected_result, content }: ViewSolutionModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onOpenChange}>
            <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-md bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="border-b border-divider px-6 py-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">Risinājuma kods</span>
                        <span className="text-sm text-default-600">
                            {filename} • {pr_lang} • {author} • {content.split('\n').length} rindas • {content.length} simboli • {expected_result}
                        </span>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <textarea
                        value={content || ''}
                        readOnly
                        className="h-full w-full p-2 border border-divider rounded-sm bg-gray-50 font-mono text-sm resize-none"
                        placeholder="Nav pieejams koda saturs"
                    />
                </div>

                <div className="flex justify-end border-t border-divider px-6 py-4">
                    <button
                        className="rounded-md border border-divider px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={onOpenChange}
                        type="button"
                    >
                        Aizvērt
                    </button>
                </div>
            </div>
        </div>
    );
}