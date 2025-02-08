"use client";
import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import Sidebar from "@/components/sidebar";

import User from "./navbar-user";
import React from "react";
import { IconInbox, IconListDetails } from "@tabler/icons-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  active: "tasks" | "submissions";
}

const MobileNavigationModal = ({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) => (
  <Modal
    backdrop="blur"
    className="mx-2"
    isOpen={isOpen}
    placement="center"
    onOpenChange={onOpenChange}
    hideCloseButton={true}
  >
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1 -mb-2">
        Navigācijas izvēlne
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-8 mt-6 mb-10 mx-8">
          <Link href="/tasks" className="flex items-center gap-2" onClick={onClose}><IconListDetails />Uzdevumi </Link>
          <Link href="/submissions" className="flex items-center gap-2" onClick={onClose}><IconInbox />Iesūtījumi </Link>
        </div>
      </ModalBody>
    </ModalContent>
  </Modal>
);

const MobileMenuButton = ({ onOpen }: { onOpen: () => void }) => (
  <div className="flex md:hidden">
    <Button
      isIconOnly
      size="sm"
      variant="light"
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
    <ol className="flex gap-x-1.5 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <li>
            <Link
              className={cn("text-default-500 hover:underline",{"text-default-900":index===items.length-1})}
              href={item.href}
            >
              {item.label}
            </Link>
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
  const {
    isOpen: isMobileMenuOpen,
    onOpen: onMobileMenuOpen,
    onClose: onMobileMenuClose,
    onOpenChange: onMobileMenuOpenChange,
  } = useDisclosure();

  return (
    <>
      <MobileNavigationModal
        isOpen={isMobileMenuOpen}
        onOpenChange={onMobileMenuOpenChange}
        onClose={onMobileMenuClose}
      />

      <div className="min-h-screen w-full">
        <Sidebar active={active} />

        <div className="overflow-auto md:ml-16 min-h-screen">
          <Header
            breadcrumbs={breadcrumbs}
            onMobileMenuOpen={onMobileMenuOpen}
          />

          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
