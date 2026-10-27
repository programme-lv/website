"use client";

import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import AuthForm from "./auth-form";
import ForgotPasswordForm from "./forgot-password-form";

interface AuthModalProps {
  type: "login" | "register";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  redirect?: string;
}

type ModalView = "login" | "register" | "forgot-password";

export default function AuthModal({ type, isOpen, onOpenChange, redirect }: AuthModalProps) {
  const [view, setView] = useState<ModalView>(type);

  useEffect(() => {
    if (isOpen) {
      setView(type);
    }
  }, [isOpen, type]);

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="blur"
      >
        <Modal.Container placement="center" scroll="inside" size={view === "register" ? "lg" : "md"}>
          <Modal.Dialog>
            <Modal.Body className="px-1 sm:px-1.5">
              {view === "forgot-password" ? (
                <ForgotPasswordForm onBackToLogin={() => setView("login")} />
              ) : (
                <AuthForm
                  type={view}
                  redirect={redirect}
                  onSwitchToLogin={() => setView("login")}
                  onSwitchToRegister={() => setView("register")}
                  onSwitchToForgotPassword={() => setView("forgot-password")}
                />
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
