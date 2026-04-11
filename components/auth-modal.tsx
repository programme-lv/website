"use client";

import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import AuthForm from "./auth-form";

interface AuthModalProps {
  type: "login" | "register";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  redirect?: string;
}

export default function AuthModal({ type, isOpen, onOpenChange, redirect }: AuthModalProps) {
  const [formType, setFormType] = useState<"login" | "register">(type);

  useEffect(() => {
    if (isOpen) {
      setFormType(type);
    }
  }, [isOpen, type]);

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="blur"
      >
        <Modal.Container placement="center" scroll="inside" size={formType === "register" ? "lg" : "md"}>
          <Modal.Dialog>
            <Modal.Body className="px-1 sm:px-1.5">
              <AuthForm
                type={formType}
                redirect={redirect}
                onSwitchToLogin={() => setFormType("login")}
                onSwitchToRegister={() => setFormType("register")}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}


