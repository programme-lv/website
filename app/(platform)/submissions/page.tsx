export const dynamic = "force-dynamic";
export const revalidate = 60; // 1 minute

import Layout from "@/components/layout";
import RealTimeSubmTable from "./live-subm-table";
import { Suspense } from "react";
import SubmissionsToolbar from "./submissions-toolbar";
import whoami from "@/lib/user/whoami";
import { listSubmissionsServerSide } from "@/lib/subm/list-ss";
import { PaginatedSubmListResponse } from "@/types/subm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iesūtījumi",
};

// This is the correct pattern for server components in Next.js
export default async function SubmissionListServerComponent(props: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string; my?: string }>;
}) {
  const searchParams = await props.searchParams;
  // Parse search params safely
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 30;
  const offset = (page - 1) * limit;
  const search = searchParams.search;
  const my = searchParams.my;

  // Get user info first to check if they're authenticated
  const userResponse = await whoami();
  const user = userResponse.data;

  // If requesting "my" submissions but user is not authenticated, 
  // fetch without the my parameter to avoid authentication errors
  let actualMy = my;
  if (my === "true" && (!user || userResponse.status !== "success")) {
    actualMy = undefined; // Don't try to fetch "my" submissions if not authenticated
  }

  let submissionsResponse: PaginatedSubmListResponse;
  try {
    submissionsResponse = await listSubmissionsServerSide(offset, limit, search, actualMy);
  } catch (error: unknown) {
    console.error("Error fetching submissions:", error);
    return <div>Error fetching submissions</div>;
  }

  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  // Calculate total pages for pagination
  const totalPages = Math.max(
    1,
    Math.ceil(
      submissionsResponse.pagination.total /
        submissionsResponse.pagination.limit
    )
  );

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="px-4">
        {/* Pagination above the table */}
        <div className="mb-2 mt-4 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 xl:flex-nowrap xl:items-center xl:justify-between">
          <div className="hidden shrink-0 px-2 text-gray-500 xl:block">
            {submissionsResponse.pagination.total === 0
              ? "Nav iesūtījumu"
              : `Rāda iesūtījumus ${submissionsResponse.pagination.offset + 1}-${submissionsResponse.pagination.offset + submissionsResponse.pagination.limit} no ${submissionsResponse.pagination.total}.`}
          </div>
          <Suspense
            fallback={
              <div className="h-11 w-full min-w-0 rounded-sm border border-divider bg-default-100/80 md:h-auto md:min-h-11" />
            }
          >
            <SubmissionsToolbar
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
            />
          </Suspense>
        </div>

        {/* Table with white background */}
        <div className="overflow-x-auto w-full h-full min-w-full my-3 p-3 border-small border-divider rounded-sm bg-white">
          <Suspense
            fallback={
              <div className="p-4 text-center">Ielādē iesūtījumus...</div>
            }
          >
            <RealTimeSubmTable
              initial={submissionsResponse.page}
              initialPagination={submissionsResponse.pagination}
              search={search}
              my={my}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
