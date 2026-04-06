"use client";

import { Modal } from "@heroui/react";
import AuthForm from "./auth-form";

interface AuthModalProps {
  type: "login" | "register";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  redirect?: string;
}

export default function AuthModal({ type, isOpen, onOpenChange, redirect }: AuthModalProps) {
  return (
    <Modal >
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="blur"
      >
        <Modal.Container placement="center" scroll="inside" size="md">
          <Modal.Dialog>
            <Modal.Body>
              <AuthForm type={type} redirect={redirect} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}


