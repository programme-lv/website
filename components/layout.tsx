"use client";
import {
  Button,
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

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs }) => {
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
        disableAnimation
        backdrop="blur"
        className="mx-2"
        isOpen={isMobileMenuOpen}
        placement="center"
        onOpenChange={onMobileMenuOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 -mb-2">
            Navigācijas izvēlne
          </ModalHeader>
          <ModalBody>
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

      <div className="flex h-screen w-full">
        <Sidebar active="tasks" />

        {/* Main Content Area */}
        <div
          className="w-full flex flex-1 flex-col p-2 overflow-y-scroll"
          style={{ backgroundColor: "#f8f8f8" }}
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-1 rounded-small border-small border-divider px-2 md:px-4 py-2 bg-white h-[50px]">
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
                      className="text-default-500"
                      height={24}
                      icon="solar:hamburger-menu-outline"
                      width={24}
                    />
                  </Button>
                </div>

                {/* Breadcrumbs */}
                <nav className="hidden sm:block">
                  <ul className="flex space-x-2">
                    {breadcrumbs.map((item, index) => (
                      <li key={index}>
                        <Link
                          className="text-gray-700 hover:underline"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                        {index < breadcrumbs.length - 1 && <span>/</span>}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <User />
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;