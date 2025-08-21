"use client";

import React from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import AuthForm from "./auth-form";

interface AuthModalProps {
  type: "login" | "register";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  redirect?: string;
}

export default function AuthModal({ type, isOpen, onOpenChange, redirect }: AuthModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={false}
      size="md"
      placement="center"
      scrollBehavior="inside"
      radius="sm"
      disableAnimation
    >
      <ModalContent>
        {() => (
          <ModalBody>
            <AuthForm type={type} redirect={redirect} />
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}


