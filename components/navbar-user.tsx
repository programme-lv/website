"use client";
import { AuthContext } from "@/app/providers";
import { removeJwt } from "@/lib/jwt";
import { Icon } from "@iconify/react";
import { Avatar, Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useContext, useEffect } from "react";

export default function User() {
    const authContext = useContext(AuthContext);
    const user = authContext.user;

    let redirectParam = "";
    useEffect(() => {
        if (typeof window !== "undefined") {
            redirectParam = `?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
    }, []);

    return (

        <div className="flex items-center gap-3">
            {!user && (
                <Link href={`/login${redirectParam}`}>
                    <Button
                        className="bg-blue-700 font-medium text-background gap-1 ps-4"
                        color="secondary"
                        endContent={<IconChevronRight size={14} />}
                        radius="full"
                        size="sm"
                        variant="flat"
                    >
                        Pieslēgties
                    </Button>
                </Link>
            )}
            {user && (
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <button className="outline-none transition-transform flex gap-3 items-center">
                            <div className="text-default-800 text-small">
                                {user.username}
                            </div>
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
                            key="logout"
                            color="warning"
                            onClick={() => {
                                removeJwt();
                                sessionStorage.clear();
                                authContext.refresh();
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
    )
}