export const revalidate = 60; // 1 minute
import React from "react";

import SubmissionTable from "@/components/submissions-table";
import { listSubmissions } from "@/lib/subms";
import { Divider, Spacer } from "@nextui-org/react";

export async function generateStaticParams() {
  return [];
}

export default async function SubmissionListServerComponent() {
  const submissions = await listSubmissions();

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <SubmissionTable initial={submissions ?? []} />
      <Spacer y={2} />
      <Divider />
      <Spacer y={2} />
      <p className="text-default-700 px-2">
        Šobrīd tiek attēlots nenoteikts skaits ar iesūtījumiem, t.i., netiek attēloti visi iesūtījumi, kas jebkad ir bijuši saņemti.
        Zilā krāsā iekrāsoti tie iesūtījumi, kas pieder šobrīd autentificētajam lietotājam.
        </p>
    </main>
  );
}
