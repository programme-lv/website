"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/lib/auth";
import Alert from "@/components/alert";
import AuthField from "@/components/auth-field";
import GenericButton from "@/components/generic-button";
import { TextLink } from "@/components/ui/text-link";
import { IconSend } from "@tabler/icons-react";

type ForgotPasswordFormProps = {
  /** When set (e.g. in AuthModal), "back to login" switches view instead of navigating. */
  onBackToLogin?: () => void;
};

export default function ForgotPasswordForm({
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [login, setLogin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () => requestPasswordReset(login),
    onMutate: () => setError(null),
    onSuccess: (response) => {
      if (response.status === "success") {
        setDone(true);
        return;
      }
      setError(response.message || "Neizdevās nosūtīt e-pastu");
    },
    onError: () => setError("Neizdevās nosūtīt e-pastu"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[1.75rem] font-normal leading-tight tracking-tight text-[#161616]">
          Aizmirsāt paroli?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#525252]">
          Ievadiet lietotājvārdu vai e-pastu. Ja konts eksistē, nosūtīsim
          atjaunošanas saiti.
        </p>
      </div>

      {done ? (
        <Alert
          message="Ja konts eksistē, e-pasts ar norādījumiem ir nosūtīts."
          type="success"
          onClose={() => setDone(false)}
        />
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <AuthField
            label="Lietotājvārds vai e-pasts"
            name="login"
            autoComplete="username"
            required
            disabled={mutation.isPending}
            value={login}
            onChange={setLogin}
          />
          <GenericButton
            className="mt-2"
            fullWidth
            isLoading={mutation.isPending}
            type="submit"
            variant="primary"
            icon={<IconSend size={20} stroke={1.75} />}
          >
            Nosūtīt saiti
          </GenericButton>
        </form>
      )}

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      <p className="text-sm">
        {onBackToLogin ? (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-blue-800 underline underline-offset-2 decoration-blue-800/30 hover:decoration-blue-800/90"
            onClick={onBackToLogin}
          >
            Atpakaļ uz pieslēgšanos
          </button>
        ) : (
          <TextLink color="default" weight="medium" href="/login">
            Atpakaļ uz pieslēgšanos
          </TextLink>
        )}
      </p>
    </div>
  );
}
