export const dynamic = "force-dynamic";
export const revalidate = 60; // 1 minute

import Layout from "@/components/layout";
import RealTimeSubmTable from "./real-time";
import { Suspense } from "react";
import PaginationControl from "@/components/pagination-control";
import SearchInput from "./search-input";
import MySubmissionsCheckbox from "./my-checkbox";
import whoami from "@/lib/user/whoami";
import { listSubmissionsServerSide } from "@/lib/subm/list-ss";
import { PaginatedSubmListResponse } from "@/types/subm";

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
      <div className="px-3">
        {/* Pagination above the table */}
        <div className="flex justify-end xl:justify-between gap-x-4 flex-wrap items-center mt-4 mb-2">
          <div className="text-gray-500 px-2 hidden xl:block">
            {submissionsResponse.pagination.total === 0
              ? "Nav iesūtījumu"
              : `Rāda iesūtījumus ${submissionsResponse.pagination.offset + 1}-${submissionsResponse.pagination.offset + submissionsResponse.pagination.limit} no ${submissionsResponse.pagination.total}.`}
          </div>
          <div className="flex flex-row gap-2 flex-wrap justify-end">
            {user && <MySubmissionsCheckbox/>}
            <SearchInput />
            <PaginationControl
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
            />
          </div>
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
              currentPage={page}
              search={search}
              my={my}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
