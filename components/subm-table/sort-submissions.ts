import { BriefSubmission } from "@/types/proglv";

export function sortSubmissions(
  submissions: BriefSubmission[],
): BriefSubmission[] {
  const sorted = submissions.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    if (a.subm_uuid < b.subm_uuid) {
      return 1;
    }
    if (a.subm_uuid > b.subm_uuid) {
      return -1;
    }

    return 0;
  });

  // sort testgroups inside submissions if they exist
  // sorted.forEach((subm) => {
  //   if (subm.eval_scoring_testgroups) {
  //     subm.eval_scoring_testgroups.sort((a, b) => {
  //       if (a.test_group_id < b.test_group_id) {
  //         return -1;
  //       }
  //       if (a.test_group_id > b.test_group_id) {
  //         return 1;
  //       }

  //       return 0;
  //     });
  //   }
  // });

  return sorted;
}
