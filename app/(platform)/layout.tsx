"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/sidebar";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/components/cn";
import { Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, Popover, PopoverContent, PopoverTrigger, ScrollShadow, Spacer, useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Logo from "@/public/logo.png";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Task, getTaskById } from "@/lib/tasks";
import Link from "next/link";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";

type Page = "task-list" | "task-view" | "submission-list" | "submission-view" | "";
type BreadcrumbItem = { label: string, href: string };

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isCompact = isCollapsed || isMobile;
    const { task_id, subm_id } = useParams();
    const [taskCodeFullNameDict, setTaskCodeFullNameDict] = useState<Record<string, string>>({});
    const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose, onOpenChange: onMobileMenuOpenChange } = useDisclosure();
    const pathname = usePathname()
    const [disabledPointerEvents, setDisabledPointerEvents] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    const onSidebarToggle = React.useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);


    const [page, setPage] = useState<Page>("");

    useEffect(() => {
        if (pathname) {
            if (pathname.match(/\/tasks\/\w+/)) {
                setPage("task-view");
            } else if (pathname.startsWith("/tasks")) {
                setPage("task-list");
            } else if (pathname.match(/\/submissions\/\w+/)) {
                setPage("submission-view");
            } else if (pathname.startsWith("/submissions")) {
                setPage("submission-list");
            }
        } else setPage("");
    }, [pathname]);

    console.log("page state: " + page)
    console.log("breadcrumbs state: " + breadcrumbs)


    useEffect(() => {
        onMobileMenuClose();
    }, [pathname])

    console.log(pathname)

    // apply this fix to mobile menu to prevent click passthrough through
    // navigation menu modal backdrop
    useEffect(() => {
        setTimeout(() => {
            setDisabledPointerEvents(isMobileMenuOpen);
        }, 50);
    }, [isMobileMenuOpen]);

    const fetchTask = async () => {
        if (!task_id) return;

        try {
            const fetchedTask = await getTaskById(task_id as string);
            setTaskCodeFullNameDict(taskCodeFullNameDict => ({ ...taskCodeFullNameDict, [task_id + ""]: fetchedTask.task_full_name }));
        } catch (err) {
            console.error("Failed to load task details");
        }
    };

    useEffect(() => { fetchTask() }, [task_id]);

    function constructPageBreadcrumbs() {
        switch (page) {
            case "task-list":
                console.log("constructing task list breadcrumbs")
                setBreadcrumbs([
                    {
                        href: "/tasks",
                        label: "Uzdevumi",
                    }
                ])
                break;
            case "task-view":
                setBreadcrumbs([
                    {
                        href: "/tasks",
                        label: "Uzdevumi",
                    },
                    {
                        href: `/tasks/${task_id}`,
                        label: `${taskCodeFullNameDict[task_id + ""] ?? task_id}`,
                    }
                ])
                break;
            case "submission-list":
                setBreadcrumbs([
                    {
                        href: "/submissions",
                        label: "Iesūtījumi",
                    },
                ])
                break;
            case "submission-view":
                setBreadcrumbs([
                    {
                        href: "/submissions",
                        label: "Iesūtījumi",
                    },
                    {
                        href: `/submissions/${subm_id}`,
                        label: `${subm_id}`,
                    }
                ])
                break;
            case "":
                setBreadcrumbs([])
                break;
            default:
                console.error("Unknown page: " + page);
                break;
        }
    }

    useEffect(() => {
        constructPageBreadcrumbs();
    }, [page, task_id, subm_id, taskCodeFullNameDict]);

    let defaultSelectedKey = "";
    switch (page) {
        case "task-list":
            defaultSelectedKey = "tasks";
            break;
        case "task-view":
            defaultSelectedKey = "tasks";
            break;
        case "submission-list":
            defaultSelectedKey = "submissions";
            break;
        case "submission-view":
            defaultSelectedKey = "submissions";
            break;
        default:
            break;
    }

    return (
        <>
            <Modal
                isOpen={isMobileMenuOpen}
                onOpenChange={onMobileMenuOpenChange}
                placement="center"
                className="mx-2"
                disableAnimation={true}
                backdrop="blur"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 -mb-2">Navigācijas izvēlne</ModalHeader>
                    <ModalBody>
                        <div className="bg-white">
                            <Sidebar
                                defaultSelectedKey={defaultSelectedKey}
                                selectedKeys={[defaultSelectedKey]}
                                isCompact={false}
                                items={sectionItemsWithTeams}
                                itemClasses={{
                                    base: "my-6"
                                }}/>
<Spacer y={2} />

<Divider />
<Spacer y={6} />
                    <Breadcrumbs className="z-10 sm:hidden block mx-2" size="lg">
                                    {breadcrumbs.map((item, index) => (
                                        <BreadcrumbItem key={index} href={item.href}>
                                            {item.label}
                                        </BreadcrumbItem>
                                    ))}
                                </Breadcrumbs>
                            
                        </div>
                        <Spacer y={6} />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className={cn("flex h-dvh w-full", { "pointer-events-none": disabledPointerEvents })}>

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
                            <Link href={"/"}>
                                <Image src={Logo} alt="programme.lv logo" height={40} />
                            </Link>
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
                            defaultSelectedKey={defaultSelectedKey}
                            selectedKeys={[defaultSelectedKey]}
                            isCompact={isCompact}
                            items={sectionItemsWithTeams}
                            itemClasses={{
                                base: "my-2"
                            }}
                        />
                    </ScrollShadow>
                </div>
                <div className="w-full flex flex-1 flex-col p-3" style={{
                    backgroundColor: "#f8f8f8",
                }} >
                    <header className="flex flex-col items-center justify-between gap-1 rounded-small border-small border-divider p-2 bg-white">
                        <div className="flex items-center justify-between w-full">
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
                                    <Button isIconOnly size="sm" variant="light" onPressStart={onMobileMenuOpen}>
                                        <Icon
                                            className="text-default-500"
                                            height={24}
                                            icon="solar:hamburger-menu-outline"
                                            width={24}
                                        />
                                    </Button>
                                </div>

                                <Breadcrumbs className="z-10 hidden sm:block">
                                    {breadcrumbs.map((item, index) => (
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
                        </div> 
                        {/* <Breadcrumbs className="z-10 sm:hidden block">
                                    {breadcrumbs.map((item, index) => (
                                        <BreadcrumbItem key={index} href={item.href}>
                                            {item.label}
                                        </BreadcrumbItem>
                                    ))}
                                </Breadcrumbs>  */}
                    </header>
                    {children}
                </div>
            </div>
        </>
    );
}