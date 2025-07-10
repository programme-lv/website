"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import ShikiCodeBlock from "@/components/ro-shiki-code";

interface Solution {
    filename: string;
    pr_lang: string;
    content: string;
    expected_result: string;
    author: string;
    pub_run_result: string;
    pub_run_uuid: string;
    draft_run_result: string;
    draft_run_uuid: string;
}

interface ViewSolutionModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    solution: Solution | null;
}

const languageMap: Record<string, string> = {
    'Python 3.11': 'python',
    'C++ 17': 'cpp',
    'Java 17': 'java',
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
    'C 11': 'c',
    'Go': 'go',
    'Rust': 'rust',
    'PHP': 'php',
    'Ruby': 'ruby',
    'C#': 'csharp',
    'Kotlin': 'kotlin',
    'Scala': 'scala',
    'Haskell': 'haskell',
    'OCaml': 'ocaml',
    'Pascal': 'pascal',
    'Perl': 'perl'
};

export default function ViewSolutionModal({ isOpen, onOpenChange, solution }: ViewSolutionModalProps) {
    if (!solution) return null;

    const getLanguageId = (displayName: string): string => {
        return languageMap[displayName] || 'text';
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="4xl"
            radius="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="border-b border-divider py-3">
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">Risinājuma kods</span>
                                <span className="text-sm text-default-600">
                                    {solution.filename} • {solution.pr_lang} • {solution.author}
                                </span>
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4 p-3 bg-default-50 rounded-sm">
                                    <div>
                                        <span className="text-tiny text-default-600">Sagaidāmais rezultāts</span>
                                        <div className="text-sm">{solution.expected_result}</div>
                                    </div>
                                    <div>
                                        <span className="text-tiny text-default-600">Autors</span>
                                        <div className="text-sm">{solution.author}</div>
                                    </div>
                                </div>
                                
                                <ShikiCodeBlock lang={getLanguageId(solution.pr_lang)}>
                                    {solution.content}
                                </ShikiCodeBlock>
                            </div>
                        </ModalBody>

                        <ModalFooter className="border-t border-divider">
                            <Button 
                                color="primary" 
                                variant="light"
                                onPress={onClose}
                            >
                                Aizvērt
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}