"use client";
import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownTrigger,
} from "@heroui/react";
import { IconChevronRight, IconLogout, IconUser } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { AuthContext } from "@/app/providers";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";
import AuthModal from "./auth-modal";

export default function User() {
    const router = useRouter();
    const pathname = usePathname();
    const authContext = useContext(AuthContext);
    const user = authContext.user;

    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <div className="flex items-center gap-3">
            {!user && (
                <>
                    <Button
                        className="inline-flex items-center gap-1.5 rounded-md ps-4 font-medium"
                        size="sm"
                        variant="primary"
                        onPress={() => {
                            setIsAuthOpen(true);
                        }}
                    >
                        Pieslēgties
                        <IconChevronRight size={16} aria-hidden />
                    </Button>
                    <AuthModal
                        type="login"
                        isOpen={isAuthOpen}
                        onOpenChange={setIsAuthOpen}
                        redirect={pathname}
                    />
                </>
            )}
            {user && (
                <Dropdown>
                    <DropdownTrigger className="text-default-800 flex h-auto min-w-0 max-w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-default-100 data-[pressed]:bg-default-100">
                        <span className="min-w-0 flex-1 truncate text-left text-small">
                            {user.username}
                        </span>
                        <Badge.Anchor className="shrink-0">
                            <Avatar size="sm">
                                <Avatar.Fallback className="text-xs">
                                    {user.username.slice(0, 2).toUpperCase()}
                                </Avatar.Fallback>
                            </Avatar>
                            <Badge
                                className="ring-background min-h-2.5 min-w-2.5 border-0 p-0 ring-2"
                                color="success"
                                placement="bottom-right"
                                size="sm"
                                variant="primary"
                            />
                        </Badge.Anchor>
                    </DropdownTrigger>
                    <DropdownPopover
                        className="min-w-48 rounded-md"
                        placement="bottom end"
                    >
                        <DropdownMenu
                            aria-label="Profile Actions"
                            onAction={async (key) => {
                                const actionKey = String(key);
                                if (actionKey === "profile") {
                                    router.push(`/users/${user.username}`);
                                    return;
                                }
                                if (actionKey === "logout") {
                                    sessionStorage.clear();
                                    const res = await logoutUser();
                                    if (res.status === "success") {
                                        authContext.setUser(null);
                                        window.location.href = "/";
                                    } else {
                                        alert("Kļūda: " + res.message);
                                    }
                                }
                            }}
                        >
                            <DropdownItem
                                key="profile"
                                textValue="Profils"
                                className="gap-3 rounded-md"
                            >
                                <span className="flex w-full items-center justify-between gap-3">
                                    <span>Profils</span>
                                    <IconUser size={16} className="shrink-0 text-default-400" aria-hidden />
                                </span>
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                variant="danger"
                                textValue="Iziet no sistēmas"
                                className="gap-3 rounded-md"
                            >
                                <span className="flex w-full items-center justify-between gap-3">
                                    <span>Iziet no sistēmas</span>
                                    <IconLogout size={16} className="shrink-0" aria-hidden />
                                </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </DropdownPopover>
                </Dropdown>
            )}
        </div>
    );
}
