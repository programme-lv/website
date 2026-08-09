import "server-only";

import { Execution, TestRes } from "@/types/exec";
import { SERVER_API_HOST } from "@/lib/config";
import { getAdminApiKey } from "@/lib/server-config";

function stripTestDetails(test: TestRes): TestRes {
  return {
    ...test,
    inp: null,
    ans: null,
    subm_rd: test.subm_rd
      ? {
          ...test.subm_rd,
          in: "",
          out: "",
          err: "",
        }
      : null,
    tlib_rd: null,
  };
}

export const getExec = async (
  execUuid: string,
  includeTestDetails: boolean,
): Promise<Execution> => {
  const response = await fetch(
    `${SERVER_API_HOST}/exec/${encodeURIComponent(execUuid)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAdminApiKey()}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data } };
  }

  const execution: Execution = data.data;

  if (!includeTestDetails) {
    execution.test_res = execution.test_res.map(stripTestDetails);
  }

  return execution;
};
