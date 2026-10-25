import Layout from "@/components/layout";

const bar = "animate-pulse rounded-sm bg-gray-300";

// Widths mirror typical header values so the skeleton keeps the same visual
// rhythm as the loaded page (username, task name, date, status, score).
const headerEntries = [
  { label: "w-9", value: "w-12" },
  { label: "w-16", value: "w-32" },
  { label: "w-10", value: "w-10" },
  { label: "w-11", value: "w-[144px]" },
  { label: "w-10", value: "w-14" },
  { label: "w-12", value: "w-14" },
];

function TestGroupRowSkeleton() {
  return (
    <div className="flex min-h-[42px] items-center gap-x-4 rounded-sm border-small border-divider px-2 py-2 sm:px-3">
      <div className={`h-4 w-12 ${bar}`} />
      <div className={`h-4 w-16 ${bar}`} />
      <div className={`h-4 w-14 ${bar}`} />
      <div className={`h-4 w-16 ${bar}`} />
      <div className={`ml-auto h-4 w-4 ${bar}`} />
    </div>
  );
}

export default function SubmissionLoadingSkeleton() {
  return (
    <Layout active="submissions">
      <div className="flex flex-col gap-3 py-4" aria-busy="true">
        {/* Submission summary card. */}
        <div className="rounded-sm border-small border-divider bg-white p-3">
          <div className="flex flex-wrap gap-x-6 gap-y-3 px-1 lg:gap-8 xl:gap-10">
            {headerEntries.map((entry, i) => (
              <div key={i} className="flex h-[44px] flex-col justify-between">
                <div className={`h-3 ${entry.label} ${bar}`} />
                <div className={`h-4 ${entry.value} ${bar}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Solution code block. */}
        <div className="rounded-sm border-small border-divider bg-white p-3">
          <div className="flex flex-col gap-2.5 py-1" aria-hidden="true">
            {["w-2/5", "w-3/5", "w-1/2", "w-4/5", "w-1/3", "w-2/3", "w-3/5", "w-1/4"].map(
              (width, i) => (
                <div key={i} className={`h-4 ${width} ${bar}`} />
              ),
            )}
          </div>
        </div>

        {/* Test results: subtask headings with collapsible test-group rows. */}
        <div className="rounded-sm border-small border-divider bg-white p-3">
          <div className="flex flex-col gap-4">
            {[0, 1].map((section) => (
              <div key={section}>
                <div className={`mb-1 mt-2 h-4 w-64 max-w-[70%] ${bar}`} />
                <div className="flex flex-col gap-2">
                  {[0, 1, 2, 3].map((group) => (
                    <TestGroupRowSkeleton key={group} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
