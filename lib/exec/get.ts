import "server-only";

import { Execution } from "@/types/exec";
import { SERVER_API_HOST } from "@/lib/config";
import { getAdminApiKey } from "@/lib/server-config";

export const getExec = async (execUuid: string): Promise<Execution> => {
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

  return data.data;
};
