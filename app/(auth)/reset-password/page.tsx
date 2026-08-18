"use client";

import { Suspense, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "@/lib/auth";
import Alert from "@/components/alert";
import AuthField from "@/components/auth-field";
import GenericButton from "@/components/generic-button";
import { TextLink } from "@/components/text-link";
import AuthCardWithBG from "@/components/auth-card-with-bg";
import { IconKey } from "@tabler/icons-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => confirmPasswordReset(token, password),
    onMutate: () => setError(null),
    onSuccess: (response) => {
      if (response.status === "success") {
        router.push("/login");
        return;
      }
      setError(response.message || "Neizdevās atjaunot paroli");
    },
    onError: () => setError("Neizdevās atjaunot paroli"),
  });

  if (!token) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-[1.75rem] font-normal leading-tight tracking-tight text-[#161616]">
          Atjaunot paroli
        </h1>
        <Alert
          message="Trūkst derīgas atjaunošanas saites."
          type="error"
          onClose={() => undefined}
        />
        <p className="text-sm">
          <TextLink color="default" weight="medium" href="/forgot-password">
            Pieprasīt jaunu saiti
          </TextLink>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[1.75rem] font-normal leading-tight tracking-tight text-[#161616]">
          Jauna parole
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#525252]">
          Ievadiet jauno paroli (vismaz 8 simboli).
        </p>
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (password !== confirm) {
            setError("Paroles nesakrīt");
            return;
          }
          if (password.length < 8) {
            setError("Parolei jābūt vismaz 8 simbolus garai");
            return;
          }
          mutation.mutate();
        }}
      >
        <AuthField
          label="Jaunā parole"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={mutation.isPending}
          value={password}
          onChange={setPassword}
        />
        <AuthField
          label="Apstipriniet paroli"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={mutation.isPending}
          value={confirm}
          onChange={setConfirm}
        />
        {error && (
          <Alert message={error} type="error" onClose={() => setError(null)} />
        )}
        <GenericButton
          className="mt-2"
          fullWidth
          isLoading={mutation.isPending}
          type="submit"
          variant="primary"
          icon={<IconKey size={20} stroke={1.75} />}
        >
          Saglabāt paroli
        </GenericButton>
      </form>
      <p className="text-sm">
        <TextLink color="default" weight="medium" href="/login">
          Atpakaļ uz pieslēgšanos
        </TextLink>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCardWithBG type="reset-password">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthCardWithBG>
  );
}
