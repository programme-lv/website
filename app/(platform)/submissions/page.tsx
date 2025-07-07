export const dynamic = "force-dynamic";
export const revalidate = 60; // 1 minute

import { listSubmissions } from "@/lib/subms";
import Layout from "@/components/layout";
import RealTimeSubmTable from "@/components/subm-list-real-time";
import { Suspense } from "react";
import PaginationControl from "@/components/pagination-control";
import { Input } from "@heroui/react";
import SearchInput from "./search-input";
import GenericButton from "@/components/generic-button";
import { IconSearch } from "@tabler/icons-react";

// This is the correct pattern for server components in Next.js
export default async function SubmissionListServerComponent(props: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  // Parse search params safely
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 30;
  const offset = (page - 1) * limit;
  const search = searchParams.search;

  const submissionsResponse = await listSubmissions(offset, limit, search);
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
        <div className="flex justify-end lg:justify-between gap-x-4 flex-wrap items-center mt-4 mb-2">
          <div className="text-gray-500 px-2 hidden lg:block">
            {submissionsResponse.pagination.total === 0
              ? "Nav iesūtījumu"
              : `Rāda iesūtījumus ${submissionsResponse.pagination.offset + 1}-${submissionsResponse.pagination.offset + submissionsResponse.pagination.limit} no ${submissionsResponse.pagination.total}.`}
          </div>
          <div className="flex flex-row gap-2 flex-wrap justify-end">
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
              search={search || ""}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
