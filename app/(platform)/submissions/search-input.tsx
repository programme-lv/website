"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";
import GenericButton from "@/components/generic-button";
import { IconSearch } from "@tabler/icons-react";

export default function SearchInput() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [isPending, startTransition] = useTransition();

    // Update local state when URL params change (e.g., browser back/forward)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        if (urlSearch !== search) {
            setSearch(urlSearch);
        }
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (search === "") {
            params.delete("search");
        } else {
            params.set("search", search);
        }
        const page = params.get("page");
        if(search && page && page !== "1") {
            params.delete("page");
        }
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className="p-2 border-small border-divider rounded-sm bg-white flex flex-row gap-2 items-center">
            <Input
                placeholder="Meklēt"
                size="sm"
                className="w-48 border-divider border rounded-md"
                value={search}
                onValueChange={(e) => setSearch(e)}
                onKeyDown={handleKeyDown}
            />
            <GenericButton
                className="!min-w-0"
                icon={<IconSearch size={16} />}
                size="sm"
                onClick={handleSearch}
                isLoading={isPending}
            />
        </div>
    )
}