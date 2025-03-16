export const revalidate = 60; // 1 minute

import { listSubmissions } from "@/lib/subms";
import Layout from "@/components/layout";
import RealTimeSubmTable from "@/components/subm-list-real-time";
import { Suspense } from "react";

// This is the correct pattern for server components in Next.js
export default async function SubmissionListServerComponent(
  props: {
    searchParams: Promise<{ page?: string; limit?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  // Parse search params safely
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 30;
  const offset = (page - 1) * limit;

  const submissionsResponse = await listSubmissions(offset, limit);
  console.log(submissionsResponse);
  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="px-3">
        <div className="overflow-x-auto w-full h-full min-w-full my-3 p-3 border-small border-divider rounded-small bg-white">
          <Suspense fallback={<div>Loading submissions...</div>}>
            <RealTimeSubmTable 
              initial={submissionsResponse.page} 
              initialPagination={submissionsResponse.pagination}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
