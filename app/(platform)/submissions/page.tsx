export const revalidate = 60; // 1 minute

import React from "react";
import { Divider, Spacer } from "@nextui-org/react";

import ClientSubmissionTable from "@/components/subm-table/client-component";
import { listSubmissions } from "@/lib/subms";
import Layout from "@/components/layout";

// export async function generateStaticParams() {
//   return [];
// }

export default async function SubmissionListServerComponent() {
  // const submissions = await listSubmissions();
  const submissions = [] as [];
  const breadcrumbs = [{ label: "Iesūtījumi", href: "/submissions" }];

  return (
    <Layout breadcrumbs={breadcrumbs} active="submissions">
      <ClientSubmissionTable initial={submissions ?? []} />
      <Spacer y={2} />
      <Divider />
      <Spacer y={2} />
      <p className="text-default-700 px-2">
        Šobrīd tiek attēlots nenoteikts skaits ar iesūtījumiem, t.i., netiek
        attēloti visi iesūtījumi, kas jebkad ir bijuši saņemti.
      </p>
    </Layout>
  );
}
