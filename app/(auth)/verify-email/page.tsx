"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmEmailVerification } from "@/lib/auth";
import Alert from "@/components/alert";
import { TextLink } from "@/components/ui/text-link";
import AuthCardWithBG from "@/components/auth-card-with-bg";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    token ? "Apstiprinām e-pastu…" : "Trūkst derīgas apstiprinājuma saites."
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    let cancelled = false;
    confirmEmailVerification(token)
      .then((response) => {
        if (cancelled) {
          return;
        }
        if (response.status === "success") {
          setStatus("success");
          setMessage("E-pasts apstiprināts.");
          return;
        }
        setStatus("error");
        setMessage(response.message || "Neizdevās apstiprināt e-pastu.");
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setStatus("error");
        setMessage("Neizdevās apstiprināt e-pastu.");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[1.75rem] font-normal leading-tight tracking-tight text-[#161616]">
        E-pasta apstiprināšana
      </h1>
      <Alert
        message={message}
        type={
          status === "error" ? "error" : status === "success" ? "success" : "info"
        }
        onClose={() => undefined}
      />
      <p className="text-sm">
        <TextLink color="default" weight="medium" href="/login">
          Uz pieslēgšanos
        </TextLink>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCardWithBG type="verify-email">
      <Suspense>
        <VerifyEmailContent />
      </Suspense>
    </AuthCardWithBG>
  );
}
