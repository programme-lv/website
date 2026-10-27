"use client";

import AuthCardWithBG from "@/components/auth-card-with-bg";
import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCardWithBG type="forgot-password">
      <ForgotPasswordForm />
    </AuthCardWithBG>
  );
}
