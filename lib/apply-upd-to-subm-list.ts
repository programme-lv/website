import {
  BriefSubmission,
  SubmListWebSocketUpdate,
  TestgroupResUpdate,
  TestsResUpdate,
} from "@/types/proglv";

export const statusImportance: Record<string, number> = {
  waiting: 0,
  received: 1,
  compiling: 2,
  testing: 3,
  finished: 4,
  error: 5,
  compile_error: 6,
  runtime_error: 7,
  checker_error: 8,
};

export function applyUpdatesToSubmissions(
  submissions: BriefSubmission[],
  updates: SubmListWebSocketUpdate[],
): BriefSubmission[] {
  const updatedSubms = submissions.map((subm) => ({ ...subm })); // Create shallow copies

  const submUuidToIndex = new Map(updatedSubms.map((s, i) => [s.subm_uuid, i]));

  for (let update of updates) {
    if ("subm_created" in update && update.subm_created) {
      if (!submUuidToIndex.has(update.subm_created.subm_uuid)) {
        updatedSubms.push({ ...update.subm_created });
        submUuidToIndex.set(
          update.subm_created.subm_uuid,
          updatedSubms.length - 1,
        );
      }
    } else if ("state_update" in update && update.state_update) {
      let index = submUuidToIndex.get(update.state_update.subm_uuid);

      if (
        index !== undefined &&
        updatedSubms[index].eval_uuid === update.state_update.eval_uuid
      ) {
        const new_state_importance =
          statusImportance[update.state_update.new_state];
        const old_state_importance =
          statusImportance[updatedSubms[index].eval_status];

        if (new_state_importance > old_state_importance) {
          updatedSubms[index] = {
            ...updatedSubms[index],
            eval_status: update.state_update.new_state,
          };
        }
      }
    } else if (
      "testgroup_res_update" in update &&
      update.testgroup_res_update
    ) {
      let index = submUuidToIndex.get(update.testgroup_res_update.subm_uuid);

      if (
        index !== undefined &&
        updatedSubms[index].eval_uuid === update.testgroup_res_update.eval_uuid
      ) {
        const test_group_id = update.testgroup_res_update.test_group_id;
        const new_untested_testcount =
          update.testgroup_res_update.untested_tests;
        const old_testgroup_index = updatedSubms[index].test_groups.findIndex(
          (tg) => tg.test_group_id === test_group_id,
        );
        const old_untested_testcount =
          old_testgroup_index >= 0
            ? updatedSubms[index].test_groups[old_testgroup_index]
                .untested_tests
            : 0;

        if (new_untested_testcount < old_untested_testcount) {
          updatedSubms[index] = {
            ...updatedSubms[index],
            test_groups: updatedSubms[index].test_groups.map((tg, i) => {
              if (i === old_testgroup_index) {
                return {
                  ...tg,
                  untested_tests: new_untested_testcount,
                  accepted_tests: (
                    update as { testgroup_res_update: TestgroupResUpdate }
                  ).testgroup_res_update.accepted_tests,
                  wrong_tests: (
                    update as { testgroup_res_update: TestgroupResUpdate }
                  ).testgroup_res_update.wrong_tests,
                };
              }

              return tg;
            }),
          };
        }
      }
    } else if ("tests_score_update" in update && update.tests_score_update) {
      let index = submUuidToIndex.get(update.tests_score_update.subm_uuid);

      if (
        index !== undefined &&
        updatedSubms[index].eval_uuid === update.tests_score_update.eval_uuid
      ) {
        const new_score_untested = update.tests_score_update.untested;
        const old_score_untested = updatedSubms[index].test_set
          ? updatedSubms[index].test_set.untested
          : 0;

        if (new_score_untested < old_score_untested) {
          updatedSubms[index] = {
            ...updatedSubms[index],
            test_set: {
              accepted: (update as { tests_score_update: TestsResUpdate })
                .tests_score_update.accepted,
              wrong: (update as { tests_score_update: TestsResUpdate })
                .tests_score_update.wrong,
              untested: new_score_untested,
            },
          };
        }
      }
    }
  }

  return updatedSubms;
}
