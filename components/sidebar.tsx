import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "@heroui/tooltip";
import { IconInbox, IconListDetails, IconTerminal2 } from "@tabler/icons-react";
import React from "react";

import Logo from "@/public/emoji-logo.png";

import { cn } from "./cn";

type SidebarItem = {
  href: string;
  icon: React.ElementType;
  title: string;
  key: string;
};

const items: SidebarItem[] = [
  {
    key: "tasks",
    href: "/tasks",
    icon: IconListDetails,
    title: "Uzdevumi",
  },

  {
    key: "submissions",
    href: "/submissions",
    icon: IconInbox,
    title: "Iesūtījumi",
  },

  {
    key: "admin",
    href: "/admin",
    icon: IconTerminal2,
    title: "Admin",
  },
];

type SidebarProps = {
  active: "tasks" | "submissions" | "admin";
};

export default function Sidebar(props: SidebarProps) {
  const filteredItems = items.filter((item) => item.key !== "admin" || props.active === "admin");

  return (
    <>
      <div className="fixed flex-col bg-white !border-r-small border-divider h-full min-w-16 hidden md:flex">
        <div className="flex items-center px-3 justify-center gap-0">
          <div className="flex mt-4 items-center">
            <Link href="/tasks">
              <Image loading="eager" alt="programme.lv logo" width={30} height={30} src={Logo.src} />
            </Link>
          </div>
        </div>
        <nav className="mt-12 flex flex-col items-center gap-8 w-full">
          {filteredItems.map((item) => (
            <Tooltip
              disableAnimation
              className="rounded-md"
              delay={500}
              closeDelay={0}
              key={item.key}
              content={item.title}
              placement="right"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-[38px] h-[38px] rounded-md",
                  props.active === item.key && "bg-gray-100",
                )}
              >
                <Link href={item.href}>
                  {React.createElement(item.icon, {
                    width: 24,
                    className: cn(
                      "hover:text-default-800",
                      props.active === item.key && "text-default-800",
                    ),
                  })}
                </Link>
              </div>
            </Tooltip>
          ))}
        </nav>
      </div>
    </>
  );
}
