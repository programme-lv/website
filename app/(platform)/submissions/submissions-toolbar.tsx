"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Modal, cn } from "@heroui/react";
import { IconFilter } from "@tabler/icons-react";

import PaginationControl from "@/components/pagination-control";
import SearchInput from "./search-input";
import MySubmissionsCheckbox from "./my-checkbox";

type SubmissionsToolbarProps = {
  currentPage: number;
  totalPages: number;
  limit: number;
  /** Total submissions (for mobile range summary). */
  totalSubmissions: number;
};

function useHasActiveFilters(): boolean {
  const searchParams = useSearchParams();
  const q = (searchParams.get("search") ?? "").trim();
  const mine = searchParams.get("my") === "true";
  return q !== "" || mine;
}

export default function SubmissionsToolbar({
  currentPage,
  totalPages,
  limit,
  totalSubmissions,
}: SubmissionsToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = useHasActiveFilters();

  const offset = (currentPage - 1) * limit;
  const rangeFrom =
    totalSubmissions === 0 ? 0 : Math.min(offset + 1, totalSubmissions);
  const rangeTo =
    totalSubmissions === 0
      ? 0
      : Math.min(offset + limit, totalSubmissions);

  return (
    <div className="w-full min-w-0 xl:w-auto xl:max-w-full">
      {/* Mobile: page & range (left) · Filtri + prev/next (right) */}
      <div className="flex w-full min-w-0 items-center justify-between gap-2 md:hidden">
        <div
          className="min-w-0 flex-1 px-1 text-left text-sm  leading-snug text-gray-500"
          aria-live="polite"
        >
          {totalSubmissions === 0 ? (
            <span className="text-default-700">Nav iesūtījumu</span>
          ) : (
            <>
              <div className="font-medium text-default-800">
                {currentPage}. lapa
              </div>
              <div className="tabular-nums text-gray-500">
                {rangeFrom}–{rangeTo}/{totalSubmissions}
              </div>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "inline-flex h-9 min-h-9 min-w-0 shrink-0 items-center gap-1.5 rounded-sm bg-white px-3 text-sm",
              hasActiveFilters && "border-primary text-primary"
            )}
            onPress={() => setFiltersOpen(true)}
          >
            <IconFilter size={16} aria-hidden />
            Filtri
          </Button>
          <PaginationControl
            variant="prevNext"
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
          />
        </div>
      </div>

      <Modal>
        <Modal.Backdrop
          isOpen={filtersOpen}
          onOpenChange={setFiltersOpen}
          variant="blur"
        >
          <Modal.Container placement="bottom" scroll="inside" size="lg">
            <Modal.Dialog>
              <Modal.Header className="flex flex-row items-center justify-between gap-2 border-b border-divider px-4 py-3">
                <Modal.Heading className="text-base font-semibold">
                  Filtri
                </Modal.Heading>
                <Modal.CloseTrigger aria-label="Aizvērt" />
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4 px-4 py-4">
                <Suspense fallback={null}>
                  <MySubmissionsCheckbox />
                </Suspense>
                <SearchInput fullWidth />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Tablet/desktop: one row beside count at xl; may wrap on md–lg */}
      <div className="hidden min-w-0 max-w-full flex-row flex-wrap items-center justify-end gap-2 md:flex md:justify-end xl:flex-nowrap xl:items-center xl:gap-3">
        <Suspense fallback={null}>
          <MySubmissionsCheckbox />
        </Suspense>
        <SearchInput />
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
        />
      </div>
    </div>
  );
}
