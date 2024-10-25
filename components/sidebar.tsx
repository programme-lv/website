import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";
import { IconInbox, IconListDetails } from "@tabler/icons-react";
import React from "react";

import Logo from "@/public/logo.png";

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
];

type SidebarProps = {
  active: "tasks" | "submissions";
};

export default function Sidebar(props: SidebarProps) {
  return (
    <>
      <div className="relative h-full flex-col !border-r-small border-divider p-6 transition-width w-14 items-center px-2 py-4 hidden md:flex">
        <div className="flex items-center px-3 justify-center gap-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <Link href="/tasks">
              <Image alt="programme.lv logo" height={40} src={Logo} />
            </Link>
          </div>
        </div>
        <nav className="mt-12 flex flex-col gap-8 w-full">
          {items.map((item) => (
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
                      "text-default-600",
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
