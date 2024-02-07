import type { InferResponseType } from "hono";
import { client } from "$lib/model/service/client";
import type { PageLoad } from "./$types";
import { getAuthHeader } from "$lib/model/constants";
import { PUBLIC_BASE_ORIGIN } from "$env/static/public";

export const load = (async ({ params }) => {
  const { path: filePath, key } = params;
  const apiGetItem = client.v1.assets[":key"].item.$get;

  async function getItem(): Promise<InferResponseType<typeof apiGetItem>> {
    const res = await apiGetItem(
      {
        param: { key },
        query: { filePath },
      },
      {
        headers: {
          authorization: getAuthHeader(key),
          referer: PUBLIC_BASE_ORIGIN,
        },
      },
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return await res.json();
  }
  return { getItem };
}) satisfies PageLoad;

export const prerender = false;
