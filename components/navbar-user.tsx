"use client";
import {
    Avatar,
    Badge,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { IconChevronRight, IconLogout, IconUser } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";
import GenericButton from "./generic-button";
import AuthModal from "./auth-modal";

export default function User() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const user = authContext.user;

    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [redirectValue, setRedirectValue] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setRedirectValue(window.location.pathname);
        }
    }, []);

    return (
        <div className="flex items-center gap-3">
            {!user && (
                // <Button
                //   className="font-medium gap-1 ps-4"
                //   color="primary"
                //   endContent={<IconChevronRight size={14} />}
                //   radius="md"
                //   size="sm"
                //   variant="solid"
                //   onPress={() => {
                //     router.push(`/login${redirectParam}`);
                //   }}
                // >
                //   Pieslēgties
                // </Button>
                <>
                    <GenericButton
                        variant="primary"
                        size="sm"
                        icon={<IconChevronRight size={16} />}
                        onClick={() => {
                            setIsAuthOpen(true);
                        }}
                    >
                        Pieslēgties
                    </GenericButton>
                    <AuthModal
                        type="login"
                        isOpen={isAuthOpen}
                        onOpenChange={setIsAuthOpen}
                        redirect={redirectValue}
                    />
                </>
            )}
            {user && (
                <Dropdown
                    placement="bottom-end"
                    disableAnimation
                    radius="sm"
                    classNames={{
                        content: "rounded-md",
                    }}
                >
                    <DropdownTrigger>
                        <button className="outline-none transition-transform flex gap-3 items-center">
                            <div className="text-default-800 text-small">{user.username}</div>
                            <Badge
                                className="border-transparent"
                                color="success"
                                content=""
                                placement="bottom-right"
                                shape="circle"
                                size="sm"
                            >
                                <Avatar size="sm" />
                            </Badge>
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem
                            disableAnimation
                            key="profile"
                            className="flex gap-2 items-center justify-between rounded-md"
                            onPress={() => {
                                router.push(`/users/${user.username}`);
                            }}
                        >
                            <div className="flex gap-2 items-center justify-between">
                                <span>Profils</span>
                                <span>
                                    <IconUser size={16} />
                                </span>
                            </div>
                        </DropdownItem>
                        <DropdownItem
                            disableAnimation
                            key="logout"
                            color="secondary"
                            className="rounded-md"
                            onClick={() => {
                                alert("Iziet no sistēmas");
                            }}
                            onPress={async () => {
                                alert("Iziet no sistēmas");
                                sessionStorage.clear();
                                const res = await logoutUser();
                                if (res.status === "success") {
                                    authContext.setUser(null);
                                    router.push("/");
                                } else {
                                    alert("Kļūda: " + res.message);
                                }
                            }}
                        >
                            <div className="flex gap-2 items-center justify-between">
                                <span>Iziet no sistēmas</span>
                                <span>
                                    <IconLogout size={16} />
                                </span>
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
}
