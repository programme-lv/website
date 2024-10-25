"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { IconLogout } from "@tabler/icons-react";

import { removeJwt } from "@/lib/jwt";
import Logo from "@/public/logo.png";
import { cn } from "@/components/cn";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import Sidebar from "@/components/sidebar";
import { AuthContext } from "@/app/providers";


interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs }) => {
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose, onOpenChange: onMobileMenuOpenChange } = useDisclosure();
  const [disabledPointerEvents, setDisabledPointerEvents] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [defaultSelectedKey, setDefaultSelectedKey] = useState<string>("");

  // Determine default selected key based on breadcrumbs
  useEffect(() => {
    if (breadcrumbs.length > 0) {
      const topLevel = breadcrumbs[0].href.split("/")[1];
      setDefaultSelectedKey(topLevel);
    }
  }, [breadcrumbs]);

  // Prevent click passthrough when mobile menu is open
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabledPointerEvents(isMobileMenuOpen);
    }, 50);
    return () => clearTimeout(timeout);
  }, [isMobileMenuOpen]);

  const [redirectParam, setRedirectParam] = useState<string>("");
  useEffect(() => {
    if (window !== undefined) {
      setRedirectParam(`?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, []);

  return (
    <>
      {/* Mobile Navigation Modal */}
      <Modal
        backdrop="blur"
        className="mx-2"
        disableAnimation
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

      <div
        className={cn("flex h-screen w-full", {
          "pointer-events-none": disabledPointerEvents,
        })}
      >
        <Sidebar active="tasks"/>
        {/* Sidebar
        <div
          className={cn(
            "relative h-full w-60 flex-col !border-r-small border-divider p-6 transition-width",
            { "w-14 items-center px-2 py-4": true }, // isCompact is always true
            "hidden md:flex"
          )}
        >
          <div
            className={cn("flex items-center gap-3 px-3", {
              "justify-center gap-0": true, // isCompact is always true
            })}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              <Link href="/tasks">
                <Image alt="programme.lv logo" height={40} src={Logo} />
              </Link>
            </div>
            <span
              className={cn("text-small font-medium uppercase opacity-100", {
                "w-0 opacity-0 hidden": true, // isCompact is always true
              })}
            >
              programme.lv
            </span>
          </div>
          <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
            <Sidebar
              defaultSelectedKey={defaultSelectedKey}
              isCompact={true}
              itemClasses={{ base: "my-2" }}
              items={sectionItemsWithTeams}
              selectedKeys={[defaultSelectedKey]}
            />
          </ScrollShadow>
        </div> */}

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
                        <Link href={item.href} className="text-gray-700 hover:underline">
                          {item.label}
                        </Link>
                        {index < breadcrumbs.length - 1 && <span>/</span>}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {!user && (
                  <Link href={`/login${redirectParam}`}>
                    <Button
                      className="bg-blue-700 font-medium text-background"
                      color="secondary"
                      endContent={<Icon icon="solar:alt-arrow-right-linear" />}
                      radius="full"
                      size="sm"
                      variant="flat"
                    >
                      Pieslēgties
                    </Button>
                  </Link>
                )}
                {user && (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <button className="outline-none transition-transform flex gap-3 items-center">
                        <div className="text-default-800 text-small">
                          {user.username}
                        </div>
                        <Badge
                          className="border-transparent"
                          color="success"
                          content=""
                          placement="bottom-right"
                          shape="circle"
                          size="sm"
                        >
                          <Avatar size="sm" />
                        </Badge>
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem
                        key="logout"
                        color="warning"
                        onClick={() => {
                          removeJwt();
                          sessionStorage.clear();
                          authContext.refresh();
                        }}
                      >
                        <div className="flex gap-2 items-center justify-between">
                          <span>Iziet no sistēmas</span>
                          <span>
                            <IconLogout size={16} />
                          </span>
                        </div>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
