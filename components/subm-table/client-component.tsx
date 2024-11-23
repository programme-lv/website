"use client"; // Declare this as a client-side component

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { subscribeToSubmUpdates, listSubmissions } from "@/lib/subms";
import { BriefSubmission, SubmListWebSocketUpdate } from "@/types/proglv";

import { applyUpdatesToSubmissions } from "./apply-updates";
import { sortSubmissions } from "./sort-submissions";
import SubmissionTableServer from "./server-component";

export default function ClientSubmissionTable({
  initial,
}: {
  initial: BriefSubmission[];
}) {
  const [updates, setUpdates] = useState<SubmListWebSocketUpdate[]>([]);
  const [submissions, setSubmissions] = useState<BriefSubmission[]>(initial);
  const { data } = useQuery("submissions", listSubmissions, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    const unsubscribe = subscribeToSubmUpdates(
      (update: SubmListWebSocketUpdate) => {
        setUpdates((prev) => {
          if (prev.length >= 10000) prev.shift();

          return [...prev, update];
        });
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSubmissions((prevSubms) => {
      const updatedSubms = applyUpdatesToSubmissions(
        data ?? prevSubms,
        updates,
      );

      return sortSubmissions(updatedSubms);
    });
  }, [data, updates]);

  return (
    <SubmissionTableServer
      skeleton={submissions.length ? false : true}
      submissions={submissions}
    />
  );
}

// Sorting and update logic can remain the same as the original code
