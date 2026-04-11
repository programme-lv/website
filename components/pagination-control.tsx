"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pagination } from "@heroui/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  limit?: number;
  /** Full page list (default) or only previous/next for compact layouts. */
  variant?: "full" | "prevNext";
}

/** Page numbers plus ellipsis markers for gaps (HeroUI v3 compound Pagination). */
function visiblePageTokens(
  current: number,
  total: number,
  siblings: number
): (number | "ellipsis")[] {
  if (total < 1) return [];
  if (total === 1) return [1];

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let p = left; p <= right; p++) pages.add(p);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      out.push("ellipsis");
    }
    out.push(sorted[i]);
  }
  return out;
}

export default function PaginationControl({
  currentPage,
  totalPages,
  limit,
  variant = "full",
}: PaginationControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChangingPage, setIsChangingPage] = useState(false);

  useEffect(() => {
    setIsChangingPage(false);
  }, [currentPage]);

  const pageTokens = useMemo(
    () => visiblePageTokens(currentPage, totalPages, 1),
    [currentPage, totalPages]
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setIsChangingPage(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (limit) {
      params.set("limit", limit.toString());
    }

    await router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages < 1) {
    return null;
  }

  /* Flat grey pills + blue active: HeroUI defaults are very low-contrast on white. */
  const navClass =
    "rounded-small !bg-zinc-200 !text-zinc-800 shadow-sm transition-[background-color,color] hover:!bg-zinc-300 data-[hovered]:!bg-zinc-300";
  const pageIdleClass =
    "min-w-8 rounded-small font-medium tabular-nums !bg-zinc-200 !text-zinc-800 shadow-sm transition-[background-color,color] hover:!bg-zinc-300 data-[hovered]:!bg-zinc-300";
  const pageActiveClass =
    "min-w-8 rounded-small font-medium tabular-nums !bg-blue-600 !text-white shadow-sm hover:!bg-blue-700 data-[hovered]:!bg-blue-700";

  /* Compact nav pills for prev/next-only (e.g. mobile toolbar next to Filtri). */
  const navClassCompact =
    "rounded-small h-7 min-h-7 min-w-7 w-7 !bg-zinc-200 !text-zinc-800 shadow-sm transition-[background-color,color] hover:!bg-zinc-300 data-[hovered]:!bg-zinc-300 [&_svg]:size-3.5";

  if (variant === "prevNext") {
    return (
      <div className="box-border inline-flex h-9 min-h-9 min-w-0 shrink-0 items-center rounded-sm border-small border-divider bg-white px-1">
        <Pagination
          size="sm"
          className="m-0 min-h-0 min-w-0 gap-0 border-0 bg-transparent p-0 text-xs shadow-none"
        >
          <Pagination.Content className="flex min-h-0 min-w-0 flex-nowrap items-center gap-1 py-0">
            <Pagination.Item className="shrink-0">
              <Pagination.Previous
                aria-label="Iepriekšējā lapa"
                className={navClassCompact}
                isDisabled={currentPage <= 1 || isChangingPage}
                onPress={() => void handlePageChange(currentPage - 1)}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            <Pagination.Item className="shrink-0">
              <Pagination.Next
                aria-label="Nākamā lapa"
                className={navClassCompact}
                isDisabled={currentPage >= totalPages || isChangingPage}
                onPress={() => void handlePageChange(currentPage + 1)}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    );
  }

  return (
    <div className="box-border inline-flex h-11 min-h-11 min-w-0 max-w-full items-center rounded-sm border-small border-divider bg-white px-1.5">
      <Pagination
        size="sm"
        className="m-0 min-h-0 w-auto min-w-0 gap-0 border-0 bg-transparent p-0 text-sm shadow-none"
      >
        <Pagination.Content className="flex min-h-0 min-w-0 max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto overflow-y-hidden overscroll-x-contain py-0 [scrollbar-width:thin]">
          <Pagination.Item className="shrink-0">
            <Pagination.Previous
              aria-label="Iepriekšējā lapa"
              className={navClass}
              isDisabled={currentPage <= 1 || isChangingPage}
              onPress={() => void handlePageChange(currentPage - 1)}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>

          {pageTokens.map((token, idx) => (
            <Pagination.Item
              key={typeof token === "number" ? `page-${token}` : `gap-${idx}`}
              className="shrink-0"
            >
              {token === "ellipsis" ? (
                <Pagination.Ellipsis className="text-zinc-500" />
              ) : (
                <Pagination.Link
                  isActive={token === currentPage}
                  isDisabled={isChangingPage}
                  className={
                    token === currentPage ? pageActiveClass : pageIdleClass
                  }
                  onPress={() => void handlePageChange(token)}
                >
                  {token}
                </Pagination.Link>
              )}
            </Pagination.Item>
          ))}

          <Pagination.Item className="shrink-0">
            <Pagination.Next
              aria-label="Nākamā lapa"
              className={navClass}
              isDisabled={currentPage >= totalPages || isChangingPage}
              onPress={() => void handlePageChange(currentPage + 1)}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}
