"use client";

import { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

import { AuthContext } from "@/app/providers";
import {
  changePassword,
  requestEmailVerification,
  updateProfile,
} from "@/lib/auth";
import { User } from "@/types/proglv";
import Alert from "@/components/alert";
import AuthField from "@/components/auth-field";
import GenericButton from "@/components/generic-button";

function formatError(error: string) {
  return error.charAt(0).toUpperCase() + error.slice(1) + ".";
}

export default function AccountCard({ user }: { user: User }) {
  const { setUser } = useContext(AuthContext);
  const [firstname, setFirstname] = useState(user.firstname ?? "");
  const [lastname, setLastname] = useState(user.lastname ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyInfo, setVerifyInfo] = useState<string | null>(null);

  useEffect(() => {
    setFirstname(user.firstname ?? "");
    setLastname(user.lastname ?? "");
  }, [user.firstname, user.lastname]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onMutate: () => setProfileError(null),
    onSuccess: (response) => {
      if (response.status === "success") {
        setUser((prev) => ({
          ...prev,
          ...response.data,
          email_verified:
            response.data.email_verified ?? prev?.email_verified,
        }));
        toast.success("Profils saglabāts");
        return;
      }
      setProfileError(formatError(response.message));
    },
    onError: () => setProfileError("Neizdevās saglabāt profilu."),
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onMutate: () => setPasswordError(null),
    onSuccess: (response) => {
      if (response.status === "success") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Parole nomainīta");
        return;
      }
      if (response.code === "username_or_password_incorrect") {
        setPasswordError("Parole nav pareiza.");
        return;
      }
      setPasswordError(formatError(response.message));
    },
    onError: () => setPasswordError("Neizdevās nomainīt paroli."),
  });

  const verifyMutation = useMutation({
    mutationFn: requestEmailVerification,
    onMutate: () => {
      setVerifyError(null);
      setVerifyInfo(null);
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        setVerifyInfo(
          response.data.message || "Apstiprinājuma e-pasts ir nosūtīts."
        );
        return;
      }
      if (response.code === "email_send_too_frequent") {
        setVerifyError(
          "E-pastu var nosūtīt atkārtoti pēc 5 minūtēm."
        );
        return;
      }
      setVerifyError(formatError(response.message));
    },
    onError: () => setVerifyError("Neizdevās nosūtīt apstiprinājuma e-pastu."),
  });

  const unverified = user.email_verified !== true;

  return (
    <div className="bg-white p-3 rounded-sm border-small border-divider">
      <h2 className="text-xl">Konts</h2>
      <div className="mt-4 flex max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AuthField
            label="Lietotājvārds"
            name="username"
            autoComplete="username"
            disabled
            value={user.username}
            onChange={() => undefined}
          />
          <div className="flex flex-col gap-1">
            <AuthField
              label="E-pasts"
              name="email"
              type="email"
              autoComplete="email"
              disabled
              value={user.email}
              onChange={() => undefined}
            />
            <p className="text-xs text-[#6f6f6f]">
              {unverified
                ? "E-pasts nav apstiprināts."
                : "E-pasts ir apstiprināts."}
            </p>
          </div>
        </div>

        {unverified && (
          <div className="flex flex-col gap-3">
            <Alert
              message="E-pasts nav apstiprināts. Pārbaudiet iesūtni vai nosūtiet saiti vēlreiz."
              type="warning"
              onClose={() => undefined}
            />
            {verifyInfo && (
              <Alert
                message={verifyInfo}
                type="success"
                onClose={() => setVerifyInfo(null)}
              />
            )}
            {verifyError && (
              <Alert
                message={verifyError}
                type="error"
                onClose={() => setVerifyError(null)}
              />
            )}
            <GenericButton
              className="w-fit"
              rounded="sm"
              size="sm"
              variant="secondary"
              isLoading={verifyMutation.isPending}
              type="button"
              onClick={() => verifyMutation.mutate()}
            >
              Sūtīt vēlreiz
            </GenericButton>
          </div>
        )}

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            profileMutation.mutate({ firstname, lastname });
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
            <div className="flex-1">
              <AuthField
                label="Vārds (neobligāts)"
                name="firstname"
                autoComplete="given-name"
                disabled={profileMutation.isPending}
                value={firstname}
                onChange={setFirstname}
              />
            </div>
            <div className="flex-1">
              <AuthField
                label="Uzvārds (neobligāts)"
                name="lastname"
                autoComplete="family-name"
                disabled={profileMutation.isPending}
                value={lastname}
                onChange={setLastname}
              />
            </div>
          </div>
          {profileError && (
            <Alert
              message={profileError}
              type="error"
              onClose={() => setProfileError(null)}
            />
          )}
          <GenericButton
            className="w-fit"
            rounded="sm"
            size="sm"
            type="submit"
            variant="primary"
            isLoading={profileMutation.isPending}
          >
            Saglabāt
          </GenericButton>
        </form>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (newPassword !== confirmPassword) {
              setPasswordError("Paroles nesakrīt!");
              return;
            }
            passwordMutation.mutate({
              current_password: currentPassword,
              password: newPassword,
            });
          }}
        >
          <AuthField
            label="Pašreizējā parole"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            disabled={passwordMutation.isPending}
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <AuthField
            label="Jaunā parole"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={passwordMutation.isPending}
            value={newPassword}
            onChange={setNewPassword}
          />
          <AuthField
            label="Apstipriniet jauno paroli"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={passwordMutation.isPending}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <p className="text-xs text-[#6f6f6f]">
            <Link
              href="/forgot-password"
              className="text-[#6f6f6f] underline underline-offset-2 decoration-[#6f6f6f]/35 hover:text-[#525252] hover:decoration-[#525252]/70"
            >
              Aizmirsu paroli
            </Link>
          </p>
          {passwordError && (
            <Alert
              message={passwordError}
              type="error"
              onClose={() => setPasswordError(null)}
            />
          )}
          <GenericButton
            className="w-fit"
            rounded="sm"
            size="sm"
            type="submit"
            variant="primary"
            isLoading={passwordMutation.isPending}
          >
            Mainīt paroli
          </GenericButton>
        </form>
      </div>
    </div>
  );
}
