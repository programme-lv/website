"use client";

import React, { Suspense, useContext, useState } from "react";
import { useMutation } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import { registerUser, loginUser } from "@/lib/auth";
import Alert from "@/components/Alert";
import MountainsImage from "@/public/mountains.jpg";
import LogoImage from "@/public/emoji-logo.png";
import { setJwt } from "@/lib/jwt";
import { AuthContext } from "@/app/providers";

export default function AuthCardWithBG(props: { type: "login" | "register" }) {
  const { type } = props;

  return (
    <div
      className="flex min-h-screen relative w-screen items-center justify-center overflow-hidden bg-content1 p-2 pt-16 pb-16 lg:px-8"
      style={{
        backgroundImage: `url(${MountainsImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Brand Logo */}
      <div className="absolute left-2 top-2">
        <Link
          className="flex items-center p-2 bg-white rounded-md hover:bg-gray-50"
          href="/"
        >
          <Image alt="programme.lv logo" height={22} src={LogoImage} />
          <p
            className="ms-2 me-1 dark:text-white text-medium lowercase text-default-800"
            style={{ fontFamily: "sans-serif" }}
          >
            {/* <span
              className={cn("text-small font-medium uppercase opacity-100", {
                "w-0 opacity-0 hidden": isCompact,
              })}
            >
              programme.lv
            </span> */}
            programme.lv
          </p>
        </Link>
      </div>

      {/* Testimonial */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <p className="max-w-xl text-right text-white/60">
          Kur programmēšana kļūst par piedzīvojumu!
        </p>
      </div>

      {/* Auth Form */}
      <Suspense>
        <AuthForm type={type} />
      </Suspense>
    </div>
  );
}

function AuthForm({ type }: { type: "login" | "register" }) {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const registerMutation = useMutation(registerUser, {
    onMutate: () => {
      setError(null);
    },
    onSuccess: async (response) => {
      if (response.status === "success") {
        authContext.refresh();
        setIsRedirecting(true);
        loginMutation.mutate({ username, password });
      } else {
        setError(`Kļūda: ${response.message}.`);
      }
    },
    onError: (error) => {
      setError("Registration error: " + JSON.stringify(error));
    },
  });

  const loginMutation = useMutation(loginUser, {
    onMutate: () => {
      setError(null);
    },
    onSuccess: async (response) => {
      if (response.status === "success") {
        const token = response.data;

        setJwt(token);
        authContext.refresh();
        setIsRedirecting(true);
        if (redirectParam) router.push(redirectParam);
        else router.push("/tasks");
      } else {
        setError(`Kļūda: ${response.message}.`);
      }
    },
    onError: async (response) => {
      alert("Login error: " + JSON.stringify(response));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "register") {
      if (password !== repPassword) {
        setError("Paroles nesakrīt!");

        return;
      }
      registerMutation.mutate({
        username,
        email,
        password,
        firstname: firstName,
        lastname: lastName,
      });
    } else {
      loginMutation.mutate({ username, password });
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-md bg-content1 px-4 md:px-6 pb-10 pt-6 shadow-small">
      <p className="pb-2 text-xl flex gap-x-2">
        {type === "register" ? (
          <>
            <span>Reģistrācija</span>
          </>
        ) : (
          <>
            Pieslēgšanās
          </>
        )}
      </p>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input
          isRequired
          classNames={{inputWrapper: "border-small border-default-300"}}
          isDisabled={
            loginMutation.isLoading ||
            registerMutation.isLoading ||
            isRedirecting
          }
          label="Lietotājvārds"
          name="username"
          // placeholder="Ievadiet savu lietotājvārdu"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {type === "register" && (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                className="flex-1"
                classNames={{inputWrapper: "border-small border-default-300"}}
                isDisabled={
                  loginMutation.isLoading ||
                  registerMutation.isLoading ||
                  isRedirecting
                }
                label="Vārds (neobligāts)"
                name="firstName"
                // placeholder="Ievadiet savu vārdu"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                className="flex-1"
                classNames={{inputWrapper: "border-small border-default-300"}}
                isDisabled={
                  loginMutation.isLoading ||
                  registerMutation.isLoading ||
                  isRedirecting
                }
                label="Uzvārds (neobligāts)"
                name="lastName"
                // placeholder="Ievadiet savu uzvārdu"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              isRequired
              classNames={{inputWrapper: "border-small border-default-300"}}
              isDisabled={
                loginMutation.isLoading ||
                registerMutation.isLoading ||
                isRedirecting
              }
              label="E-pasta adrese"
              name="email"
              // placeholder="Ievadiet savu e-pastu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            isRequired
            className="flex-1"
            classNames={{inputWrapper: "border-small border-default-300"}}
            endContent={
              <button type="button" onMouseDown={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            isDisabled={
              loginMutation.isLoading ||
              registerMutation.isLoading ||
              isRedirecting
            }
            label="Parole"
            name="password"
            // placeholder="Ievadiet savu paroli"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {type === "register" && (
            <Input
              isRequired
              className="flex-1"
              classNames={{inputWrapper: "border-small border-default-300"}}
              isDisabled={
                loginMutation.isLoading ||
                registerMutation.isLoading ||
                isRedirecting
              }
              label="Apstipriniet paroli"
              name="confirmPassword"
              type="password"
              // placeholder="Apstipriniet savu paroli"
              value={repPassword}
              onChange={(e) => setRepPassword(e.target.value)}
            />
          )}
        </div>
        <div className="flex justify-center">
          <Button
            className="flex-grow mt-4"
            color="primary"
            isLoading={
              loginMutation.isLoading ||
              registerMutation.isLoading ||
              isRedirecting
            }
            type="submit"
          >
            {type === "register" ? "Reģistrēties" : "Pieslēgties"}
          </Button>
        </div>
      </form>

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">VAI</p>
        <Divider className="flex-1" />
      </div>
      <Suspense>
        <GoToLoginOrRegister type={type} />
      </Suspense>
    </div>
  );
}

function GoToLoginOrRegister({ type }: { type: "login" | "register" }) {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  return (
    <p className="text-center text-small">
      {type === "register" ? (
        <>
          Jau ir konts?&nbsp;
          <Link
            className="text-primary-500 hover:underline"
            href={
              redirectParam
                ? `/login?redirect=${encodeURIComponent(redirectParam)}`
                : `/login`
            }
          >
            Pieslēgties
          </Link>
        </>
      ) : (
        <>
          Nav konta?&nbsp;
          <Link
            className="text-primary-500 hover:underline"
            href={
              redirectParam
                ? `/register?redirect=${encodeURIComponent(redirectParam)}`
                : `/register`
            }
          >
            Reģistrēties
          </Link>
        </>
      )}
    </p>
  );
}
