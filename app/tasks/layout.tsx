"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/sidebar";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/components/cn";
import { Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, Popover, PopoverContent, PopoverTrigger, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Logo from "@/public/logo.png";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Task, getTaskById } from "@/lib/tasks";
import Link from "next/link";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isCompact = isCollapsed || isMobile;
    const { task_id } = useParams();
    const [taskCodeFullNameDict, setTaskCodeFullNameDict] = useState<Record<string, string>>({});
    const { isOpen: isMobileMenuOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const pathname = usePathname()
    const pageRef = useRef<HTMLDivElement>(null);
    const [disabledPointerEvents, setDisabledPointerEvents] = useState(false);

    const onSidebarToggle = React.useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    // const onMobileMenuToggle = React.useCallback(() => {
    //     setIsMobileOpen((prev) => !prev);
    // }, []);

    let breadcrumbItems = [
        {
            href: "/tasks",
            label: "Uzdevumi",
        },
    ]

    useEffect(() => {
        onClose();
    }, [pathname])

    useEffect(() => {
        setTimeout(() => {
        setDisabledPointerEvents(isMobileMenuOpen);
        }, 50);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const fetchedTask = await getTaskById(task_id as string);
                setTaskCodeFullNameDict(taskCodeFullNameDict => ({ ...taskCodeFullNameDict, [task_id + ""]: fetchedTask.task_full_name }));
                // setTask(fetchedTask);
            } catch (err) {
                console.error("Failed to load task details");
            }
        };

        fetchTask();

        // return () => {
        //     setTask(null);
        // }
    }, [task_id]);

    if (task_id) {
        if (taskCodeFullNameDict[task_id + ""]) {
            breadcrumbItems.push({
                href: `/tasks/${task_id}`,
                label: `${taskCodeFullNameDict[task_id + ""]}`,
            })
        } else {
            breadcrumbItems.push({
                href: `/tasks/${task_id}`,
                label: `${task_id}`,
            })
        }
    }

    return (
        <>
            <Modal
                isOpen={isMobileMenuOpen}
                onOpenChange={onOpenChange}
                placement="center"
                className="mx-2"
                disableAnimation={true}
                backdrop="blur"
                // portalContainer={pageRef.current ?? document.body}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 -mb-2">Navigācijas izvēlne</ModalHeader>
                    <ModalBody>
                        <div className="bg-white">
                            <Sidebar
                                defaultSelectedKey="tasks"
                                isCompact={false}
                                items={sectionItemsWithTeams}
                                itemClasses={{
                                    base: "my-6"
                                }}
                            />
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className={cn("flex h-dvh w-full",{"pointer-events-none": disabledPointerEvents})} ref={pageRef}>

                <div
                    className={cn(
                        "relative h-full w-60 flex-col !border-r-small border-divider p-6 transition-width",
                        { "w-16 items-center px-2 py-6": isCompact, },
                        "hidden md:flex"
                    )}
                >
                    <div className={cn("flex items-center gap-3 px-3",
                        { "justify-center gap-0": isCompact, },)}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                            {/* <AcmeIcon className="text-background" /> */}
                            <Image src={Logo} alt="programme.lv logo" height={40} />
                        </div>
                        <span
                            className={cn("text-small font-bold uppercase opacity-100", {
                                "w-0 opacity-0 hidden": isCompact,
                            })}
                        >
                            programme.lv
                        </span>
                    </div>
                    <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                        <Sidebar
                            defaultSelectedKey="tasks"
                            isCompact={isCompact}
                            items={sectionItemsWithTeams}
                        />
                    </ScrollShadow>
                </div>
                <div className="w-full flex flex-1 flex-col p-3" style={{
                    backgroundColor: "#f8f8f8",
                }} >
                    <header className="flex items-center justify-between gap-3 rounded-medium border-small border-divider p-2 bg-white">
                        <div className="flex gap-3 items-center">
                            <div className="hidden md:flex">
                                <Button isIconOnly size="sm" variant="light" onPressStart={onSidebarToggle}>
                                    <Icon
                                        className="text-default-500"
                                        height={24}
                                        icon="solar:sidebar-minimalistic-outline"
                                        width={24}
                                    />
                                </Button>
                            </div>
                            <div className="flex md:hidden">
                                <Button isIconOnly size="sm" variant="light" onPressStart={onOpen}>
                                    <Icon
                                        className="text-default-500"
                                        height={24}
                                        icon="solar:hamburger-menu-outline"
                                        width={24}
                                    />
                                </Button>
                            </div>

                            <Breadcrumbs className="z-10">
                                {breadcrumbItems.map((item, index) => (
                                    <BreadcrumbItem key={index} href={item.href}>
                                        {item.label}
                                    </BreadcrumbItem>
                                ))}
                            </Breadcrumbs>
                        </div>

                        <div className="flex items-center gap-3">
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <button className="outline-none transition-transform flex gap-3 items-center">
                                        <div className="text-default-800 text-small">
                                            KrisjanisP
                                        </div>
                                        <Badge
                                            className="border-transparent"
                                            color="success"
                                            content=""
                                            placement="bottom-right"
                                            shape="circle"
                                            size="sm"
                                        >
                                            <Avatar size="sm" name="Krisjanis Petrucena" />
                                        </Badge>
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownItem key="profile">
                                        <div className="flex gap-2 items-center justify-between">
                                            Profils <IconUserCircle size={16} />
                                        </div>
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="warning">
                                        <div className="flex gap-2 items-center justify-between">
                                            <span>Iziet no sistēmas</span><span><IconLogout size={16} /></span>
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </header>
                    {children}
                </div>
            </div>
        </>
    );
}