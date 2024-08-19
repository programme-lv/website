export const revalidate = 60; // 1 minute
import React from "react";

import SubmissionTable from "@/components/submissions-table";
import { listSubmissions } from "@/lib/subms";

export default async function SubmissionListServerComponent() {
  const submissions = await listSubmissions();

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <SubmissionTable initialSubmissions={submissions??[]} />
    </main>
  );
}
