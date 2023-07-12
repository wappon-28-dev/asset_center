import { client } from "$lib/model/service/client";
import type { InferResponseType } from "hono";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  const { path: filePath, scope } = params;
  const apiGetItem = client.v1.assets[":scope"].item.$get;

  async function getItem(): Promise<InferResponseType<typeof apiGetItem>> {
    const res = await apiGetItem({
      param: { scope },
      query: { filePath },
    });
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      if (res.status === 404) {
        throw new Error("ASSET_NOT_FOUND");
      } else {
        throw new Error(`FETCH_ERROR ${String(await res.text())}`);
      }
    }
  }
  return { getItem };
}) satisfies PageLoad;

export const prerender = false;
