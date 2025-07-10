"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

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

export default function ViewSolutionModal({ isOpen, onOpenChange, solution }: ViewSolutionModalProps) {
    if (!solution) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="full"
            radius="sm"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="border-b border-divider py-3">
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">Risinājuma kods</span>
                                <span className="text-sm text-default-600">
                                    {solution.filename} • {solution.pr_lang} • {solution.author} • {solution.content.split('\n').length} rindas • {solution.content.length} simboli • {solution.expected_result}
                                </span>
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            <textarea
                                value={solution.content || ''}
                                readOnly
                                className="w-full h-full p-2 border border-divider rounded-sm bg-gray-50 font-mono text-sm resize-none"
                                placeholder="Nav pieejams koda saturs"
                            />
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