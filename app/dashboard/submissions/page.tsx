import DashboardLayout from "../layout";

export default function Submissions() {
    return (
        <>
        Submissions
        </>
    );
}

Submissions.getLayout = function getLayout(page: any) {
  return (
    <DashboardLayout pageID="submissions">{page}</DashboardLayout>
  )
}