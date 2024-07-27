"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/components/cn";
import { BreadcrumbItem, Breadcrumbs, Button, ScrollShadow } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Logo from "@/public/logo.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Task, getTaskById } from "@/lib/tasks";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isCompact = isCollapsed || isMobile;
    const { task_id } = useParams();
    const [taskCodeFullNameDict, setTaskCodeFullNameDict] = useState<Record<string, string>>({});

    const onToggle = React.useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    let breadcrumbItems = [
        {
            href: "/tasks",
            label: "Uzdevumi",
        },
    ]

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
        <div className="flex h-dvh w-full">
            <div
                className={cn(
                    "relative flex h-full w-60 flex-col !border-r-small border-divider p-6 transition-width",
                    {
                        "w-16 items-center px-2 py-6": isCompact,
                    },
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
                            "w-0 opacity-0": isCompact,
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
            <div className="w-full flex flex-1 flex-col p-3">
                <header className="flex items-center gap-3 rounded-medium border-small border-divider p-2">
                    <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
                        <Icon
                            className="text-default-500"
                            height={24}
                            icon="solar:sidebar-minimalistic-outline"
                            width={24}
                        />
                    </Button>

                    <Breadcrumbs>
                        {breadcrumbItems.map((item, index) => (
                            <BreadcrumbItem href={item.href} key={index}>
                                {item.label}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumbs>
                </header>
                {children}
            </div>
        </div>
    );
}