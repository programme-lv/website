"use client"; // Declare this as a client-side component

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { subscribeToSubmUpdates, listSubmissions } from "@/lib/subms";
import { SubmListEntry, SubmListSseUpdate } from "@/types/subm";
import SubmissionTable from "./submission-table";

/**
 * RealTimeSubmTable Component
 *
 * This component is responsible for displaying a table of submissions and handling real-time updates.
 *
 * Props:
 * - initial: An array of initial BriefSubmission objects to populate the table.
 * - initialPagination: Initial pagination state
 * - currentPage: Current page number
 */
export default function RealTimeSubmTable({
  initial,
  initialPagination,
  currentPage,
}: {
  initial: SubmListEntry[];
  initialPagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
  currentPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Ensure initial is always an array
  const initialSubmissions = Array.isArray(initial) ? initial : [];

  // State to hold incoming WebSocket updates
  const [updates, setUpdates] = useState<SubmListSseUpdate[]>([]);

  // State to manage the list of submissions
  const [submissions, setSubmissions] = useState<SubmListEntry[]>(initialSubmissions);

  // Detect page changes
  useEffect(() => {
    // Reset updates when page changes
    setUpdates([]);
    
    // Set loading state when page changes
    setIsChangingPage(true);
    
    // Reset loading state after a short delay
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Fetch submissions data with a polling interval of 2 seconds
  const { data, isLoading, refetch } = useQuery(
    ["submissions", initialPagination.offset, initialPagination.limit],
    () => listSubmissions(initialPagination.offset, initialPagination.limit),
    {
      refetchInterval: 2000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,        // Consider data stale immediately
      enabled: true,       // Always enable the query
      initialData: {
        page: initialSubmissions,
        pagination: initialPagination
      }, // Provide initial data to prevent flash of loading state
      refetchOnReconnect: true,
      onSettled: () => {
        setIsChangingPage(false);
      }
    }
  );

  /**
   * useEffect hook to subscribe to submission updates via WebSocket.
   * It listens for incoming updates and appends them to the updates state.
   * Ensures that the updates array does not exceed 10,000 entries.
   */
  useEffect(() => {
    const unsubscribe = subscribeToSubmUpdates(
      (update: SubmListSseUpdate) => {
        // Only process real-time updates if we're on the first page
        if (initialPagination.offset === 0 || 'eval_update' in update) {
          setUpdates((prev) => {
            if (prev.length >= 10000) prev.shift(); // Remove the oldest update if limit is reached
            return [...prev, update]; // Append the new update
          });
        }
      },
    );

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  }, [initialPagination.offset]);

  /**
   * useEffect hook to apply updates to the submissions list whenever
   * the fetched data or incoming updates change.
   * It merges the updates with the current submissions and sorts them.
   */
  useEffect(() => {
    if (data) {  // Only update when we have fresh data
      const dataArray = Array.isArray(data.page) ? data.page : [];
      
      setSubmissions((prevSubms) => {
        const updatedSubms = applyUpdatesToSubmissions(
          dataArray,           // Always use the fresh data instead of fallback
          updates,
          initialPagination.offset
        );
        return sortSubmissions(updatedSubms);
      });
    }
  }, [data, updates, initialPagination.offset]);

  return (
    <>
      {isChangingPage && (
        <div className="text-sm text-gray-500 mb-4">Ielādē iesūtījumus...</div>
      )}
      <SubmissionTable
        skeleton={(submissions.length === 0 || isChangingPage || isLoading)} // Show loading skeleton if no submissions are present or changing page
        submissions={submissions} // Pass the submissions data to the table component
      />
    </>
  );
}

// Sorting and update logic can remain the same as the original code

/**
 * sortSubmissions Function
 *
 * Sorts the array of submissions first by creation date in descending order,
 * and then by submission UUID in descending order if dates are identical.
 *
 * @param submissions - Array of Submission objects to be sorted
 * @returns A new array of sorted Submission objects
 */
function sortSubmissions(submissions: SubmListEntry[]): SubmListEntry[] {
  const sorted = submissions.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (dateA < dateB) return 1; // Newer submissions come first
    if (dateA > dateB) return -1;
    if (a.subm_uuid < b.subm_uuid) return 1; // If dates are equal, sort by UUID
    if (a.subm_uuid > b.subm_uuid) return -1;

    return 0; // If both date and UUID are equal
  });

  return sorted;
}

function applyUpdatesToSubmissions(
  submissions: SubmListEntry[],
  updates: SubmListSseUpdate[],
  offset: number = 0
): SubmListEntry[] {
  for(let update of updates) {
    if ('subm_created' in update && update.subm_created !== null) {  // Check for null
      // Only add new submissions if we're on the first page
      if (offset === 0) {
        const newSubmission = update.subm_created;  // No need for type assertion
        if (!submissions.some(s => s.subm_uuid === newSubmission.subm_uuid)) {
          submissions.push(newSubmission);
        }
      }
    }
    else if ('eval_update' in update) {  // Simplified condition
      const evalData = update.eval_update;  // Get the SubmEval object
      const index = submissions.findIndex(s => s.subm_uuid === evalData.subm_uuid);
      if (index !== -1) {
        // Update status and score info
        submissions[index].status = evalData.eval_stage;
        if (evalData.eval_error) {
          if (evalData.eval_error === "compilation") {
            submissions[index].status = "compile_error";
          } else if (evalData.eval_error === "internal") {
            submissions[index].status = "internal_error";
          } else {
            submissions[index].status = evalData.eval_error;
          }
        }
        submissions[index].score_info = evalData.score_info;
      }
    }
  }
  return [...submissions];
}
