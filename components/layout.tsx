"use client";

import { cn } from "./cn";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { IconInbox, IconListDetails, IconMenu2, IconTerminal2 } from "@tabler/icons-react";

import { AuthContext } from "@/app/providers";
import Button from "@/components/ui/button";
import Footer from "@/components/footer";
import User from "./navbar-user";

type NavKey = "tasks" | "submissions" | "admin" | "about";

interface LayoutProps {
  children: React.ReactNode;
  active: NavKey;
  wide?: boolean;
}

const navItems: { key: NavKey; href: string; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { key: "tasks", href: "/tasks", label: "Uzdevumi", icon: IconListDetails },
  { key: "submissions", href: "/submissions", label: "Iesūtījumi", icon: IconInbox },
  { key: "admin", href: "/admin", label: "Admin", icon: IconTerminal2, adminOnly: true },
];

const pageInner = "mx-auto flex h-12 w-full max-w-(--page-max) items-center gap-4 px-4";

const MobileNavigationModal = ({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: typeof navItems;
}) => (
  !isOpen ? null : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 md:hidden"
      onClick={onClose}
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
        <div className="flex flex-col gap-6 px-8 py-6">
          {items.map((item) => (
            <Link
              key={item.key}
              className="flex items-center gap-2"
              href={item.href}
              onClick={onClose}
            >
              {React.createElement(item.icon, { size: 20, "aria-hidden": true })}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
);

function Header({
  active,
  items,
  onMobileMenuOpen,
}: {
  active: NavKey;
  items: typeof navItems;
  onMobileMenuOpen: () => void;
}) {
  return (
    <header className="border-b-small border-divider bg-white">
      <div className={pageInner}>
        <Button
          aria-label="Izvēlne"
          className="md:hidden"
          icon={<IconMenu2 size={22} aria-hidden />}
          size="sm"
          variant="ghost"
          onClick={onMobileMenuOpen}
        />
        <nav className="hidden h-12 min-w-0 flex-1 items-stretch gap-5 md:flex">
          {items.map((item) => (
            <Link
              key={item.key}
              className={cn(
                "inline-flex items-center border-b-[3px] text-sm",
                active === item.key
                  ? "border-[#0f62fe] font-medium text-default-900"
                  : "border-transparent text-default-600 hover:text-default-900",
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto shrink-0">
          <User />
        </div>
      </div>
    </header>
  );
}

const Layout: React.FC<LayoutProps> = ({ children, active, wide = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const userIsAdmin = user?.username === "admin";
  const items = navItems.filter((item) => !item.adminOnly || userIsAdmin);

  return (
    <>
      <MobileNavigationModal
        isOpen={isMobileMenuOpen}
        items={items}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen flex-col">
        <Header
          active={active}
          items={items}
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
        />

        {wide ? (
          <div className="flex h-[calc(100vh-3rem)] min-h-0 flex-col overflow-hidden">
            {children}
          </div>
        ) : (
          <>
            <main className="mx-auto w-full max-w-(--page-max) flex-1 px-4 pb-8 min-h-[calc(100vh-3rem)]">
              {children}
            </main>
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
