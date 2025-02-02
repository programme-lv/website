export const revalidate = 60; // 1 minute

import Layout from "@/components/layout";
import SubmissionTable from "@/components/submission-table";


export default async function SubmissionListServerComponent() {
  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="px-3">
        <div className="overflow-x-auto w-full h-full min-w-full mt-3 p-3 border-small border-divider rounded-small bg-white">
        <SubmissionTable
          skeleton={true}
          submissions={[]}
        />
        </div>
      </div>
    </Layout>
  );
}
