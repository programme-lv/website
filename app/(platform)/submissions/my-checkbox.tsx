"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@heroui/react";

export default function MySubmissionsCheckbox() {
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
        <div className="p-2 px-3 border-small border-divider rounded-sm bg-white flex flex-row items-center">
            <Checkbox
                isSelected={mySubmissions}
                disableAnimation={true}
                onValueChange={handleToggle}
                isDisabled={isPending}
            />
            <span className="text-sm text-default-800">Mani</span>
        </div>
    )
}