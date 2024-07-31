"use client";

import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Avatar,
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
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
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { IconLogout } from "@tabler/icons-react";

import { removeJwt } from "@/lib/jwt";
import { getTaskById } from "@/lib/tasks";
import Logo from "@/public/logo.png";
import { cn } from "@/components/cn";
import { sectionItemsWithTeams } from "@/components/sidebar-items";
import Sidebar from "@/components/sidebar";

import { AuthContext } from "../providers";

type Page =
  | "task-list"
  | "task-view"
  | "submission-list"
  | "submission-view"
  | "";
type BreadcrumbItem = { label: string; href: string };

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCompact = isCollapsed || isMobile;
  const { task_id, subm_id } = useParams();
  const [taskCodeFullNameDict, setTaskCodeFullNameDict] = useState<
    Record<string, string>
  >({});
  const {
    isOpen: isMobileMenuOpen,
    onOpen: onMobileMenuOpen,
    onClose: onMobileMenuClose,
    onOpenChange: onMobileMenuOpenChange,
  } = useDisclosure();
  const pathname = usePathname();
  const [disabledPointerEvents, setDisabledPointerEvents] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const authContext = useContext(AuthContext);
  const user = authContext.user;

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

  useEffect(() => {
    onMobileMenuClose();
  }, [pathname]);

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

      setTaskCodeFullNameDict((taskCodeFullNameDict) => ({
        ...taskCodeFullNameDict,
        [task_id + ""]: fetchedTask.task_full_name,
      }));
    } catch (err) {
      // alert("Failed to load task details");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [task_id]);

  function constructPageBreadcrumbs() {
    switch (page) {
      case "task-list":
        setBreadcrumbs([
          {
            href: "/tasks",
            label: "Uzdevumi",
          },
        ]);
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
          },
        ]);
        break;
      case "submission-list":
        setBreadcrumbs([
          {
            href: "/submissions",
            label: "Iesūtījumi",
          },
        ]);
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
          },
        ]);
        break;
      default:
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

  // useEffect(() => {
  //     const userInfoFromJwt = getUserInfoFromJWT();
  //     if (userInfoFromJwt === null) {
  //         setUser(null);
  //     } else {
  //         setUser({
  //             username: userInfoFromJwt?.username ?? "",
  //             email: userInfoFromJwt?.email ?? "",
  //             firstName: userInfoFromJwt?.firstname ?? "",
  //             lastName: userInfoFromJwt?.lastname ?? "",
  //         })
  //     }
  // }, [authContext]);

  return (
    <>
      <Modal
        backdrop="blur"
        className="mx-2"
        disableAnimation={true}
        isOpen={isMobileMenuOpen}
        placement="center"
        onOpenChange={onMobileMenuOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 -mb-2">
            Navigācijas izvēlne
          </ModalHeader>
          <ModalBody>
            <div className="bg-white">
              <Sidebar
                defaultSelectedKey={defaultSelectedKey}
                isCompact={false}
                itemClasses={{
                  base: "my-6",
                }}
                items={sectionItemsWithTeams}
                selectedKeys={[defaultSelectedKey]}
              />
            </div>
            {/* <Spacer y={2} />

                            <Divider />
                            <Spacer y={6} />
                            <Breadcrumbs className="z-10 sm:hidden block mx-2" size="lg">
                                {breadcrumbs.map((item, index) => (
                                    <BreadcrumbItem key={index} href={item.href}>
                                        {item.label}
                                    </BreadcrumbItem>
                                ))}
                            </Breadcrumbs>

                        <Spacer y={6} /> */}
          </ModalBody>
        </ModalContent>
      </Modal>
      <div
        className={cn("flex h-dvh w-full", {
          "pointer-events-none": disabledPointerEvents,
        })}
      >
        <div
          className={cn(
            "relative h-full w-60 flex-col !border-r-small border-divider p-6 transition-width",
            { "w-16 items-center px-2 py-6": isCompact },
            "hidden md:flex",
          )}
        >
          <div
            className={cn("flex items-center gap-3 px-3", {
              "justify-center gap-0": isCompact,
            })}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              {/* <AcmeIcon className="text-background" /> */}
              <Link href={"/tasks"}>
                <Image alt="programme.lv logo" height={40} src={Logo} />
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
              isCompact={isCompact}
              itemClasses={{
                base: "my-2",
              }}
              items={sectionItemsWithTeams}
              selectedKeys={[defaultSelectedKey]}
            />
          </ScrollShadow>
        </div>
        <div
          className="w-full flex flex-1 flex-col p-3"
          style={{
            backgroundColor: "#f8f8f8",
          }}
        >
          <header className="flex flex-col items-center justify-between gap-1 rounded-small border-small border-divider p-2 bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-3 items-center">
                <div className="hidden md:flex">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPressStart={onSidebarToggle}
                  >
                    <Icon
                      className="text-default-500"
                      height={24}
                      icon="solar:sidebar-minimalistic-outline"
                      width={24}
                    />
                  </Button>
                </div>
                <div className="flex md:hidden">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPressStart={onMobileMenuOpen}
                  >
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
                {user === null && (
                  <>
                    <Link
                      href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    >
                      <Button
                        className="text-default-500"
                        radius="full"
                        variant="light"
                      >
                        Pieslēgties
                      </Button>
                    </Link>
                    <Link
                      href={`/register?redirect=${encodeURIComponent(pathname)}`}
                    >
                      <Button
                        className="bg-blue-700 font-medium text-background"
                        color="secondary"
                        endContent={
                          <Icon icon="solar:alt-arrow-right-linear" />
                        }
                        radius="full"
                        size="sm"
                        variant="flat"
                      >
                        Pievienoties
                      </Button>
                    </Link>
                  </>
                )}
                {user && (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <button className="outline-none transition-transform flex gap-3 items-center">
                        <div className="text-default-800 text-small">
                          {user?.username}
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
                      {/* <DropdownItem key="profile">
                      <div className="flex gap-2 items-center justify-between">
                        Profils <IconUserCircle size={16} />
                      </div>
                    </DropdownItem> */}
                      <DropdownItem
                        key="logout"
                        color="warning"
                        onClick={() => {
                          removeJwt();
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
