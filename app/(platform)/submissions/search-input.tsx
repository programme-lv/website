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
        setSearch((prev) => (prev === urlSearch ? prev : urlSearch));
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

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className="box-border flex h-11 min-h-11 shrink-0 flex-row items-center gap-2 rounded-sm border-small border-divider bg-white px-1">
            {/* <TextInput
                name="search"
                placeholder="Meklēt"
                value={search}
                onChange={setSearch}
                onKeyDown={handleKeyDown}
                className="w-48"
            /> */}
            <Input
                name="search"
                placeholder="Meklēt"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-48 min-h-8"
                variant="secondary"
            />
            <GenericButton
                className="min-w-0!"
                icon={<IconSearch size={16} />}
                size="sm"
                onClick={handleSearch}
                isLoading={isPending}
            />
        </div>
    )
}