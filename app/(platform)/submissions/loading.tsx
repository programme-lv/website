import Layout from "@/components/layout";
import SubmissionTable from "@/components/submission-table";

export default function SubmissionsLoadingSkeleton() {
  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="px-4">
        {/* Skeleton for pagination/controls above the table */}
        <div className="flex justify-end xl:justify-between gap-x-4 flex-wrap items-center mt-4 mb-2">
          {/* Skeleton for the "Rāda iesūtījumus..." text */}
          <div className="hidden xl:block">
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Skeleton for the controls (search, pagination) */}
          <div className="flex flex-row gap-2 flex-wrap justify-end">
            {/* Skeleton for search input */}
            <div className="h-11 w-48 bg-gray-200 rounded-sm border border-divider animate-pulse" />
            
            {/* Skeleton for pagination */}
            <div className="h-11 w-[292px] bg-gray-200 rounded-sm border border-divider animate-pulse" />
          </div>
        </div>

        {/* Match page: Tailwind border on md+ so responsive panel renders correctly */}
        <div className="my-2 w-full min-w-0 md:my-3 md:overflow-x-auto md:rounded-sm md:border md:border-(--legacy-divider) md:bg-white md:p-3">
          <SubmissionTable
            skeleton={true}
            submissions={[]}
          />
        </div>
      </div>
    </Layout>
  );
}
