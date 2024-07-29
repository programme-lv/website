"use client";

import React from "react";

import SubmissionTable from "@/components/submissions-table";

export default function SubmissionList() {
  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <SubmissionTable />
    </main>
  );
}
