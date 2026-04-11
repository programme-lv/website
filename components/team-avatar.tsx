"use client";

import type { AvatarRootProps } from "@heroui/react";

import React from "react";
import { Avatar } from "@heroui/react";

import { cn } from "./cn";

export type TeamAvatarProps = Omit<AvatarRootProps, "children"> & {
	name: string;
};

function initialsFromName(name: string) {
	return (
		(name[0] || "") + (name[name.lastIndexOf(" ") + 1] || "").toUpperCase()
	);
}

const TeamAvatar = React.forwardRef<HTMLSpanElement, TeamAvatarProps>(
	({ name, className, ...props }, ref) => (
		<Avatar
			ref={ref}
			className={cn("bg-transparent border border-divider rounded-md", className)}
			size="sm"
			{...props}
		>
			<Avatar.Fallback className="text-default-500 text-[0.6rem] font-semibold">
				{initialsFromName(name)}
			</Avatar.Fallback>
		</Avatar>
	),
);

TeamAvatar.displayName = "TeamAvatar";

export default TeamAvatar;
