"use client";

import React, { Suspense } from "react";

import AuthForm from "./auth-form";

type AuthCardType =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "verify-email";

export default function AuthCardWithBG(props: {
  type?: AuthCardType;
  children?: React.ReactNode;
}) {
  const { type = "login", children } = props;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Top spacer only when viewport has room; no brand mark */}
      <div
        aria-hidden
        className="shrink-0 h-[clamp(0.75rem,10vh,5.5rem)]"
      />

      <main className="flex flex-1 justify-center px-4 pb-[clamp(1.5rem,8vh,4rem)] sm:px-6">
        <div className="w-full max-w-[22.5rem]">
          <Suspense>
            {children ??
              (type === "login" || type === "register" ? (
                <AuthForm type={type} />
              ) : null)}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
