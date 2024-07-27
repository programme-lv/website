import { Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { type SidebarItem, SidebarItemType } from "./sidebar";
import TeamAvatar from "./team-avatar";

/**
 * Please check the https://nextui.org/docs/guide/routing to have a seamless router integration
 */

export const items: SidebarItem[] = [
    {
        key: "tasks",
        href: "#",
        icon: "solar:checklist-minimalistic-outline",
        title: "Tasks",
        endContent: (
            <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
        ),
    }
];

export const sectionItems: SidebarItem[] = [
    {
        key: "overview",
        title: "",
        items: [
            {
                key: "tasks",
                href: "#",
                icon: "solar:checklist-minimalistic-outline",
                title: "Uzdevumi",
                // endContent: (
                //     <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
                // ),
            }
        ],
    }
];

export const sectionItemsWithTeams: SidebarItem[] = [
    ...sectionItems,
];

export const brandItems: SidebarItem[] = [
    {
        key: "overview",
        title: "Overview",
        items: [
            {
                key: "home",
                href: "#",
                icon: "solar:home-2-linear",
                title: "Home",
            },
            {
                key: "projects",
                href: "#",
                icon: "solar:widget-2-outline",
                title: "Projects",
                endContent: (
                    <Icon
                        className="text-primary-foreground/60"
                        icon="solar:add-circle-line-duotone"
                        width={24}
                    />
                ),
            },
            {
                key: "tasks",
                href: "#",
                icon: "solar:checklist-minimalistic-outline",
                title: "Tasks",
                endContent: (
                    <Icon
                        className="text-primary-foreground/60"
                        icon="solar:add-circle-line-duotone"
                        width={24}
                    />
                ),
            },
            {
                key: "team",
                href: "#",
                icon: "solar:users-group-two-rounded-outline",
                title: "Team",
            },
            {
                key: "tracker",
                href: "#",
                icon: "solar:sort-by-time-linear",
                title: "Tracker",
                endContent: (
                    <Chip className="bg-primary-foreground font-medium text-primary" size="sm" variant="flat">
                        New
                    </Chip>
                ),
            },
        ],
    },
];

export const sectionLongList: SidebarItem[] = [
    ...sectionItems,
    {
        key: "payments",
        title: "Payments",
        items: [
            {
                key: "payroll",
                href: "#",
                title: "Payroll",
                icon: "solar:dollar-minimalistic-linear",
            },
            {
                key: "invoices",
                href: "#",
                title: "Invoices",
                icon: "solar:file-text-linear",
            },
            {
                key: "billing",
                href: "#",
                title: "Billing",
                icon: "solar:card-outline",
            },
            {
                key: "payment-methods",
                href: "#",
                title: "Payment Methods",
                icon: "solar:wallet-money-outline",
            },
            {
                key: "payouts",
                href: "#",
                title: "Payouts",
                icon: "solar:card-transfer-outline",
            },
        ],
    },
];

export const sectionNestedItems: SidebarItem[] = [
    {
        key: "tasks",
        href: "#",
        icon: "solar:checklist-minimalistic-outline",
        title: "Tasks",
        endContent: (
            <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
        ),
    },
];
