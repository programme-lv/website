"use client";

import React, { useState, useEffect } from "react";
import { Pagination } from "@heroui/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  limit?: number;
}

export default function PaginationControl({ 
  currentPage, 
  totalPages,
  limit
}: PaginationControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChangingPage, setIsChangingPage] = useState(false);
  
  // Reset isChangingPage when currentPage changes
  useEffect(() => {
    setIsChangingPage(false);
  }, [currentPage]);
  
  const handlePageChange = async (page: number) => {
    // Set loading state
    setIsChangingPage(true);
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or add the page parameter
    params.set('page', page.toString());
    
    // Keep the limit parameter if it exists
    if (limit) {
      params.set('limit', limit.toString());
    } else if (params.has('limit')) {
      // Keep existing limit
    }
    
    // Navigate to the new URL
    await router.push(`${pathname}?${params.toString()}`);
    
    // We don't need to reset isChangingPage here as the useEffect will handle it
    // when the currentPage prop changes after navigation
  };

  return (
    <div className="min-h-[40px] min-w-[200px]"> {/* Add fixed minimum dimensions */}
      <Pagination 
        initialPage={currentPage} 
        total={totalPages} 
        onChange={handlePageChange}
        className="text-sm bg-white rounded-sm p-2 border-small border-divider m-0"
        classNames={{
          item: "rounded-small"
        }}
        showControls
        color="primary"
        variant="flat"
        size="sm"
        page={currentPage}
        isDisabled={isChangingPage}
      />
    </div>
  );
} 