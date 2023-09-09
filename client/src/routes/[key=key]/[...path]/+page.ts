import type { InferResponseType } from "hono";
import { client } from "$lib/model/service/client";
import type { PageLoad } from "./$types";
import { getAuthHeader } from "$lib/model/constants";

export const load = (async ({ params }) => {
  const { path: dirPath, key } = params;
  const apiGetChildren = client.v1.assets[":key"].children.$get;

  async function getChildren(): Promise<
    InferResponseType<typeof apiGetChildren>
  > {
    const res = await apiGetChildren(
      {
        param: { key },
        query: { dirPath },
      },
      {
        headers: {
          authorization: getAuthHeader(key),
        },
      },
    );
    const data = await res.json();

    if (res.ok) {
      return data;
    }
    if (res.status === 404) {
      throw new Error("ASSET_NOT_FOUND");
    } else {
      throw new Error(`FETCH_ERROR ${String(await res.text())}`);
    }
  }

  return { getChildren };
}) satisfies PageLoad;

export const prerender = false;
