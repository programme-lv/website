"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { subscribeToSubmUpdates } from "@/lib/subms";
import { SubmListEntry, SubmListSseUpdate } from "@/types/subm";
import SubmissionTable from "@/components/submission-table";
import { listSubmissionsClientSide } from "@/lib/subm/list";

export default function RealTimeSubmTable({
  initial,
  initialPagination,
  search,
}: {
  initial: SubmListEntry[];
  initialPagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
  search?: string;
}) {
  const [isChangingPage, setIsChangingPage] = useState(false);
  const initialSubmissions = Array.isArray(initial) ? initial : [];
  const [submissions, setSubmissions] = useState<SubmListEntry[]>(initialSubmissions);

  const { data, isLoading } = useQuery({
      queryKey: ["submissions", initialPagination.offset, initialPagination.limit, search],
      queryFn: async () => {
        return await listSubmissionsClientSide(initialPagination.offset, initialPagination.limit, search);
      },
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,
      enabled: true,
      initialData: {
        page: initialSubmissions,
        pagination: initialPagination
      },
      refetchOnReconnect: true
  });

  useEffect(() => {
    if (!isLoading) {
      setIsChangingPage(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const unsubscribe = subscribeToSubmUpdates(
      (update: SubmListSseUpdate) => {
        if (initialPagination.offset === 0 || 'eval_update' in update) {
          setSubmissions((prev) => {
            const updatedSubms = applyUpdatesToSubmissions(
              prev,
              [update],
              initialPagination.offset
            );
            return sortSubmissions(updatedSubms);
          });
        }
      },
    );

    return () => unsubscribe();
  }, [initialPagination.offset]);

  useEffect(() => {
    if (data) {
      const dataArray = Array.isArray(data.page) ? data.page : [];
      setSubmissions(sortSubmissions(dataArray));
    }
  }, [data]);

  return (
    <>
      <div className="w-full">
        <SubmissionTable
          skeleton={isChangingPage || isLoading}
          submissions={submissions}
        />
      </div>
    </>
  );
}

function sortSubmissions(submissions: SubmListEntry[]): SubmListEntry[] {
  const sorted = [...submissions].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    if (a.subm_uuid < b.subm_uuid) return 1;
    if (a.subm_uuid > b.subm_uuid) return -1;

    return 0;
  });

  return sorted;
}

function applyUpdatesToSubmissions(
  submissions: SubmListEntry[],
  updates: SubmListSseUpdate[],
  offset: number = 0
): SubmListEntry[] {
  const nextSubmissions = submissions.map((submission) => ({ ...submission }));

  for(let update of updates) {
    if ('subm_created' in update && update.subm_created !== null) {
      if (offset === 0) {
        const newSubmission = update.subm_created;
        if (!nextSubmissions.some(s => s.subm_uuid === newSubmission.subm_uuid)) {
          nextSubmissions.push(newSubmission);
        }
      }
    }
    else if ('eval_update' in update && update.eval_update) {
      const evalData = update.eval_update;
      const index = nextSubmissions.findIndex(s => s.subm_uuid === evalData.subm_uuid);
      if (index !== -1) {
        nextSubmissions[index].status = evalData.eval_stage;
        if (evalData.eval_error) {
          if (evalData.eval_error === "compilation") {
            nextSubmissions[index].status = "compile_error";
          } else if (evalData.eval_error === "internal") {
            nextSubmissions[index].status = "internal_error";
          } else {
            nextSubmissions[index].status = evalData.eval_error;
          }
        }
        nextSubmissions[index].score_info = evalData.score_info;
      }
    }
  }
  return nextSubmissions;
}
