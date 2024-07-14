"use client";

import React, { useState } from "react";
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from "@/lib/auth";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import Alert from "@/components/Alert";
import { Icon } from "@iconify/react";
import MountainsImage from "@/public/mountains.png";
import LogoImage from "@/public/logo.png";

import Image from "next/image";

export default function AuthCardWithBG(props: { type: "login" | "register" }) {
    const { type } = props;
    const [isVisible, setIsVisible] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const router = useRouter();

    const registerMutation = useMutation(registerUser, {
        onSuccess: () => {
            router.push('/status');
        },
        onError: (error) => {
            setError("Registration error: " + error.message);
        }
    });

    const loginMutation = useMutation(loginUser, {
        onSuccess: () => {
            router.push('/status');
        },
        onError: (error) => {
            setError("Login error: " + error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === "register") {
            registerMutation.mutate({ username, email, password, firstname: firstName, lastname: lastName });
        } else {
            loginMutation.mutate({username, password});
        }
    };

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    return (
        <div
            className="flex h-screen w-screen items-center justify-center overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8"
            style={{
                backgroundImage: `url(${MountainsImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Brand Logo */}
            <div className="absolute left-10 top-10 bg-white p-2 rounded-md">
                <Link className="flex items-center" href="/">
                    <Image alt="programme.lv logo" height={26} src={LogoImage} />
                    <p className="ms-2 text-black dark:text-white font-semibold">programme.lv</p>
                </Link>
            </div>

            {/* Testimonial */}
            <div className="absolute bottom-10 right-10 hidden md:block">
                <p className="max-w-xl text-right text-white/60">
                    Kur programmēšana kļūst par piedzīvojumu!
                </p>
            </div>

            {/* Auth Form */}
            <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
                <p className="pb-2 text-xl font-medium">
                    {type === "register" ? "Reģistrēties" : "Pieslēgties"}
                </p>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Lietotājvārds"
                        name="username"
                        placeholder="Ievadiet savu lietotājvārdu"
                        variant="bordered"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {type === "register" && (
                        <>
                            <div className="flex flex-col md:flex-row gap-3">
                                <Input
                                    label="Vārds (neobligāts)"
                                    name="firstName"
                                    placeholder="Ievadiet savu vārdu"
                                    variant="bordered"
                                    className="flex-1"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Input
                                    label="Uzvārds (neobligāts)"
                                    name="lastName"
                                    placeholder="Ievadiet savu uzvārdu"
                                    variant="bordered"
                                    className="flex-1"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <Input
                                isRequired
                                label="E-pasta adrese"
                                name="email"
                                placeholder="Ievadiet savu e-pastu"
                                type="email"
                                variant="bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </>
                    )}
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input
                            isRequired
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
                            label="Parole"
                            name="password"
                            placeholder="Ievadiet savu paroli"
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            className="flex-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {type === "register" && (
                            <Input
                                isRequired
                                endContent={
                                    <button type="button" onMouseDown={toggleConfirmVisibility}>
                                        {isConfirmVisible ? (
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
                                label="Apstipriniet paroli"
                                name="confirmPassword"
                                placeholder="Apstipriniet savu paroli"
                                type={isConfirmVisible ? "text" : "password"}
                                variant="bordered"
                                className="flex-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        )}
                    </div>
                    {false && type === "register" && (
                        <Checkbox isRequired className="py-4" size="sm">
                            Es piekrītu&nbsp;
                            <Link href="#" size="sm">
                                Noteikumiem
                            </Link>
                            &nbsp; un&nbsp;
                            <Link href="#" size="sm">
                                Privātuma politikai
                            </Link>
                        </Checkbox>
                    )}
                    <Button color="primary" type="submit">
                        {type === "register" ? "Reģistrēties" : "Pieslēgties"}
                    </Button>
                </form>
                <div className="flex items-center gap-4 py-2">
                    <Divider className="flex-1" />
                    <p className="shrink-0 text-tiny text-default-500">VAI</p>
                    <Divider className="flex-1" />
                </div>
                {/* <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Turpināt ar Google
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
          >
            Turpināt ar Github
          </Button>
        </div> */}
                <p className="text-center text-small">
                    {type === "register" ? (
                        <>
                            Jau ir konts?&nbsp;
                            <Link href="/auth/login" size="sm">
                                Pieslēgties
                            </Link>
                        </>
                    ) : (
                        <>
                            Nav konta?&nbsp;
                            <Link href="/auth/register" size="sm">
                                Reģistrēties
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
