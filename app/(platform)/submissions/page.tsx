export const dynamic = "force-dynamic";
export const revalidate = 60; // 1 minute

import Layout from "@/components/layout";
import RealTimeSubmTable from "./live-subm-table";
import { Suspense } from "react";
import SubmissionsToolbar from "./submissions-toolbar";
import { listSubmissionsServerSide } from "@/lib/subm/list-ss";
import { PaginatedSubmListResponse } from "@/types/subm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iesūtījumi",
};

export default async function SubmissionListServerComponent(props: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 30;
  const queryOffset = (page - 1) * limit;
  const search = searchParams.search;

  let submissionsResponse: PaginatedSubmListResponse;
  try {
    submissionsResponse = await listSubmissionsServerSide(queryOffset, limit, search);
  } catch (error: unknown) {
    console.error("Error fetching submissions:", error);
    return <div>Error fetching submissions</div>;
  }

  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  const { total, offset: paginationOffset, limit: pageLimit } =
    submissionsResponse.pagination;
  const totalPages = Math.max(
    1,
    Math.ceil(total / pageLimit)
  );
  const rangeEnd =
    total === 0 ? 0 : Math.min(paginationOffset + pageLimit, total);

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="px-4">
        <div className="mb-2 mt-4 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 xl:flex-nowrap xl:items-center xl:justify-between">
          <div className="hidden shrink-0 px-2 text-gray-500 xl:block">
            {total === 0
              ? "Nav iesūtījumu"
              : `Rāda iesūtījumus ${paginationOffset + 1}-${rangeEnd} no ${total}.`}
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
              totalSubmissions={total}
            />
          </Suspense>
        </div>

        <div className="my-2 w-full min-w-0 md:my-3 md:overflow-x-auto md:rounded-sm md:border md:border-(--legacy-divider) md:bg-white md:p-3">
          <Suspense
            fallback={
              <div className="p-4 text-center">Ielādē iesūtījumus...</div>
            }
          >
            <RealTimeSubmTable
              initial={submissionsResponse.page}
              initialPagination={submissionsResponse.pagination}
              search={search}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
