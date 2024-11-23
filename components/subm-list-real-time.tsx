"use client"; // Declare this as a client-side component

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { subscribeToSubmUpdates, listSubmissions } from "@/lib/subms";
import { BriefSubmission, SubmListWebSocketUpdate } from "@/types/proglv";
import SubmissionTable from "./submission-table";
import { applyUpdatesToSubmissions } from "@/lib/apply-upd-to-subm-list";

/**
 * RealTimeSubmTable Component
 *
 * This component is responsible for displaying a table of submissions and handling real-time updates.
 *
 * Props:
 * - initial: An array of initial BriefSubmission objects to populate the table.
 */
export default function RealTimeSubmTable({
  initial,
}: {
  initial: BriefSubmission[];
}) {
  // State to hold incoming WebSocket updates
  const [updates, setUpdates] = useState<SubmListWebSocketUpdate[]>([]);
  
  // State to manage the list of submissions
  const [submissions, setSubmissions] = useState<BriefSubmission[]>(initial);
  
  // Fetch submissions data with a polling interval of 5 seconds
  const { data } = useQuery("submissions", listSubmissions, {
    refetchInterval: 5000,
  });

  /**
   * useEffect hook to subscribe to submission updates via WebSocket.
   * It listens for incoming updates and appends them to the updates state.
   * Ensures that the updates array does not exceed 10,000 entries.
   */
  useEffect(() => {
    const unsubscribe = subscribeToSubmUpdates(
      (update: SubmListWebSocketUpdate) => {
        setUpdates((prev) => {
          if (prev.length >= 10000) prev.shift(); // Remove the oldest update if limit is reached
          return [...prev, update]; // Append the new update
        });
      },
    );

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  /**
   * useEffect hook to apply updates to the submissions list whenever
   * the fetched data or incoming updates change.
   * It merges the updates with the current submissions and sorts them.
   */
  useEffect(() => {
    setSubmissions((prevSubms) => {
      const updatedSubms = applyUpdatesToSubmissions(
        data ?? prevSubms, // Use fetched data or previous submissions as fallback
        updates, // Apply incoming updates
      );

      return sortSubmissions(updatedSubms); // Sort the updated submissions
    });
  }, [data, updates]);

  return (
    <SubmissionTable
      skeleton={submissions.length ? false : true} // Show loading skeleton if no submissions are present
      submissions={submissions} // Pass the submissions data to the table component
    />
  );
}

// Sorting and update logic can remain the same as the original code

/**
 * sortSubmissions Function
 *
 * Sorts the array of submissions first by creation date in descending order,
 * and then by submission UUID in descending order if dates are identical.
 *
 * @param submissions - Array of BriefSubmission objects to be sorted
 * @returns A new array of sorted BriefSubmission objects
 */
export function sortSubmissions(
  submissions: BriefSubmission[],
): BriefSubmission[] {
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