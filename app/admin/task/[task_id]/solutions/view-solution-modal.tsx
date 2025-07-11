"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

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
                                    {filename} • {pr_lang} • {author} • {content.split('\n').length} rindas • {content.length} simboli • {expected_result}
                                </span>
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            <textarea
                                value={content || ''}
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