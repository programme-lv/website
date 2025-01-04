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

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs, active }) => {
  const {
    isOpen: isMobileMenuOpen,
    onOpen: onMobileMenuOpen,
    onClose: onMobileMenuClose,
    onOpenChange: onMobileMenuOpenChange,
  } = useDisclosure();

  return (
    <>
      {/* Mobile Navigation Modal */}
      <Modal
        backdrop="blur"
        className="mx-2"
        isOpen={isMobileMenuOpen}
        placement="center"
        onOpenChange={onMobileMenuOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 -mb-2">
            Navigācijas izvēlne
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-8 mt-6 mb-10 mx-8">
              <Link href="/tasks" className="flex items-center gap-2" onClick={onMobileMenuClose}><IconListDetails />Uzdevumi </Link>
              <Link href="/submissions" className="flex items-center gap-2" onClick={onMobileMenuClose}><IconInbox />Iesūtījumi </Link>
            </div>
            {/* <div className="bg-white">
              <Sidebar
                defaultSelectedKey={defaultSelectedKey}
                isCompact={false}
                itemClasses={{ base: "my-6" }}
                items={sectionItemsWithTeams}
                selectedKeys={[defaultSelectedKey]}
              />
            </div> */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="flex min-h-screen w-full">
        <Sidebar active={active} />

        {/* Main Content Area */}
        <div
          className="w-full flex flex-col p-2 overflow-y-hidden"
          // style={{ backgroundImage: `url(${bg.src})` }}
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-1 rounded-small border-b-small border-divider px-2 md:px-4 py-2 bg-white h-[50px]">
            <div className="flex items-center justify-between w-full flex-wrap">
              {/* Left Section */}
              <div className="flex gap-2 items-center">
                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onMobileMenuOpen}
                  >
                    <Icon
                      className="text-default-800"
                      height={26}
                      icon="solar:hamburger-menu-outline"
                      width={26}
                    />
                  </Button>
                </div>

                {/* Breadcrumbs */}
                <nav className="hidden sm:block">
                  <ol className="flex gap-x-1.5 text-sm">
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={index}>
                      <li>
                        <Link
                          className={cn("text-default-500 hover:underline",{"text-default-900":index===breadcrumbs.length-1})}
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </li>
                      {index < breadcrumbs.length - 1 && <span className="text-default-500"> / </span>}
                      </React.Fragment>
                    ))}
                  </ol>
                </nav>
              </div>

              <User />
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
