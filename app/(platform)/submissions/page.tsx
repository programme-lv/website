export const revalidate = 60; // 1 minute

import { listSubmissions } from "@/lib/subms";
import Layout from "@/components/layout";
import RealTimeSubmTable from "@/components/subm-list-real-time";


export default async function SubmissionListServerComponent() {
  const submissions = await listSubmissions();
  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <div className="px-3">
        <div className="overflow-x-auto w-full h-full min-w-full my-3 p-3 border-small border-divider rounded-small bg-white">
          <RealTimeSubmTable initial={submissions ?? []} />
        </div>
      </div>
    </Layout>
  );
}
