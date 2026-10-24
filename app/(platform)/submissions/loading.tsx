import Layout from "@/components/layout";
import SubmissionTable from "@/components/submission-table";

const toolbarSkeletonBlock =
  "animate-pulse rounded-sm border border-divider bg-white";

export default function SubmissionsLoadingSkeleton() {
  return (
    <Layout active="submissions">
      <div className="pb-2">
        {/* Skeleton for the range text and pagination/search controls. */}
        <div className="mb-2 mt-4 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 xl:flex-nowrap xl:items-center xl:justify-between">
          <div className="hidden shrink-0 xl:block">
            <div className="h-5 w-56 animate-pulse rounded-sm bg-gray-200" />
          </div>

          <div className="w-full min-w-0 xl:w-auto">
            {/* Mobile toolbar: page summary, Filtri, previous/next. */}
            <div className="flex w-full min-w-0 items-center justify-between gap-2 md:hidden">
              <div className="min-w-0 flex-1 space-y-1 px-1">
                <div className="h-4 w-14 animate-pulse rounded-sm bg-gray-200" />
                <div className="h-4 w-16 animate-pulse rounded-sm bg-gray-200" />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className={`h-9 w-[74px] ${toolbarSkeletonBlock}`} />
                <div className={`h-9 w-[74px] ${toolbarSkeletonBlock}`} />
              </div>
            </div>

            {/* Desktop toolbar: search field and full pagination. */}
            <div className="hidden min-w-0 max-w-full flex-row flex-wrap items-center justify-end gap-2 md:flex xl:flex-nowrap xl:items-center xl:gap-3">
              <div className={`h-11 w-[240px] ${toolbarSkeletonBlock}`} />
              <div className={`h-11 w-[292px] ${toolbarSkeletonBlock}`} />
            </div>
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
