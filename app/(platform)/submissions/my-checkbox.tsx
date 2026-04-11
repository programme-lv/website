"use client";

import { useState, useEffect, useTransition, useContext } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@heroui/react";

import { AuthContext } from "@/app/providers";

export default function MySubmissionsCheckbox() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mySubmissions, setMySubmissions] = useState(searchParams.get("my") === "true");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const isMine = searchParams.get("my") === "true";
        if (isMine !== mySubmissions) {
            setMySubmissions(isMine);
        }
    }, [searchParams, mySubmissions]);

    if (!user) {
        return null;
    }

    const handleToggle = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set("my", "true");
        } else {
            params.delete("my");
        }
        const page = params.get("page");
        if(checked && page && page !== "1") {
            params.delete("page");
        }
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <div className="box-border flex h-11 min-h-11 shrink-0 flex-row items-center rounded-sm border-small border-divider bg-white px-2 pe-3">
            <Checkbox
                className="gap-2"
                isSelected={mySubmissions}
                onChange={handleToggle}
                isDisabled={isPending}
                variant="secondary"
            >
                <Checkbox.Control className="size-5">
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                    <span className="text-sm text-default-800">Mani iesūtījumi</span>
                </Checkbox.Content>
            </Checkbox>
        </div>
    )
}