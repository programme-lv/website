"use client";
import {
  Button,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import Sidebar from "@/components/sidebar";

import User from "./navbar-user";
import React, { useContext, useState } from "react";
import { IconInbox, IconListDetails, IconInfoCircle } from "@tabler/icons-react";
import { AuthContext } from "@/app/providers";
import { TextLink } from "./text-link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  active: "tasks" | "submissions" | "admin" | "about";
}

const MobileNavigationModal = ({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) => (
  !isOpen ? null : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 md:hidden"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-sm rounded-md bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-divider px-4 py-3">
          <h2 className="text-base font-semibold">Navigācijas izvēlne</h2>
          <button
            className="rounded-md px-2 py-1 text-sm text-default-700 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Aizvērt
          </button>
        </div>
        <div className="flex flex-col gap-8 px-8 py-6">
          <Link href="/tasks" className="flex items-center gap-2" onClick={onClose}><IconListDetails />Uzdevumi </Link>
          <Link href="/submissions" className="flex items-center gap-2" onClick={onClose}><IconInbox />Iesūtījumi </Link>
          <Link href="/about" className="flex items-center gap-2" onClick={onClose}><IconInfoCircle />Par mums </Link>
        </div>
      </div>
    </div>
  )
);

const MobileMenuButton = ({ onOpen }: { onOpen: () => void }) => (
  <div className="flex md:hidden">
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      onPress={onOpen}
    >
      <Icon
        className="text-default-800"
        height={26}
        icon="solar:hamburger-menu-outline"
        width={26}
      />
    </Button>
  </div>
);

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="hidden sm:block">
    <ol className="flex gap-x-1.5 text-sm font-mono">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <li>
            {item.href ? (
              <Link
                className={cn("text-default-500 hover:underline",{"text-default-800":index===items.length-1})}
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("text-default-500",{"text-default-800":index===items.length-1})}>
                {item.label}
              </span>
            )}
          </li>
          {index < items.length - 1 && <span className="text-default-500"> / </span>}
        </React.Fragment>
      ))}
    </ol>
  </nav>
);

const Header = ({
  breadcrumbs,
  onMobileMenuOpen
}: {
  breadcrumbs: BreadcrumbItem[];
  onMobileMenuOpen: () => void;
}) => (
  <header className="flex items-center justify-between gap-1 border-b-small border-divider px-2 md:px-5 py-2 bg-white min-h-14">
    <div className="flex items-center justify-between w-full flex-wrap">
      <div className="flex gap-2 items-center">
        <MobileMenuButton onOpen={onMobileMenuOpen} />
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <User />
    </div>
  </header>
);

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs, active }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const userIsAdmin = user?.username === "admin";

  return (
    <>
      <MobileNavigationModal
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="w-full">
        <Sidebar active={active} userIsAdmin={userIsAdmin}/>

        <div className="md:ml-16">
          <Header
            breadcrumbs={breadcrumbs}
            onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          />

          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
