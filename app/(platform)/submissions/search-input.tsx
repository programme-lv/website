"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import LoadingSpinner from "@/components/loading-spinner";
import { IconSearch } from "@tabler/icons-react";

export default function SearchInput({
  fullWidth = false,
}: {
  /** Full-width field (e.g. filters drawer); default is fixed width for desktop toolbar. */
  fullWidth?: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [isPending, startTransition] = useTransition();

    const trimmedInput = search.trim();
    const trimmedUrlSearch = (searchParams.get("search") ?? "").trim();
    /** Empty field and no search in URL — nothing to run or clear. */
    const canSubmitSearch = trimmedInput !== "" || trimmedUrlSearch !== "";

    // Update local state when URL params change (e.g., browser back/forward)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        setSearch((prev) => (prev === urlSearch ? prev : urlSearch));
    }, [searchParams]);

    const handleSearch = () => {
        if (!canSubmitSearch) return;
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
        if (e.key === "Enter" && canSubmitSearch) {
            handleSearch();
        }
    }

    return (
        <div
            className={
                fullWidth
                    ? "box-border flex h-11 min-h-11 w-full min-w-0 flex-row items-center gap-2 rounded-sm border-small border-divider bg-white px-1"
                    : "box-border flex h-11 min-h-11 shrink-0 flex-row items-center gap-2 rounded-sm border-small border-divider bg-white px-1"
            }
        >
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
                className={
                    fullWidth
                        ? "h-8 min-w-0 flex-1"
                        : "h-8 w-48"
                }
                variant="secondary"
            />
            <Button
                isIconOnly
                size="sm"
                variant="outline"
                aria-label="Meklēt"
                className="min-w-0 h-8 w-8 shrink-0"
                onPress={handleSearch}
                isDisabled={isPending || !canSubmitSearch}
            >
                {isPending ? (
                    <LoadingSpinner className="h-4 w-4" />
                ) : (
                    <IconSearch className="text-default-700" size={16} />
                )}
            </Button>
        </div>
    )
}