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

    if (res.ok) {
      return res.json();
    }
    if (res.status === 404) {
      throw new Error("ASSET_NOT_FOUND");
    } else {
      throw new Error(`FETCH_ERROR: ${String(await res.text())}`);
    }
  }
  return { getItem };
}) satisfies PageLoad;

export const prerender = false;
