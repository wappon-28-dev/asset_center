import { client } from "$lib/model/service/client";
import type { InferResponseType } from "hono";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  const filePath = params.path;
  const apiGetItem = client.v1.assets.public.item.$get;
  const apiGetMeta = client.v1.assets.public.meta.$get;

  async function getItem(): Promise<InferResponseType<typeof apiGetItem>> {
    const res = await apiGetItem({
      query: {
        filePath,
      },
    });
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      if (res.status === 404) {
        throw new Error("ASSET_NOT_FOUND");
      } else {
        throw new Error("FETCH_ERROR");
      }
    }
  }

  async function getMeta(): Promise<InferResponseType<typeof apiGetMeta>> {
    const res = await apiGetMeta({
      query: {
        fileOrDirPath: filePath,
      },
    });
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      if (res.status === 404) {
        throw new Error("ASSET_NOT_FOUND");
      } else {
        throw new Error("FETCH_ERROR");
      }
    }
  }

  return {
    itemDataFn: getItem,
    metaDataFn: getMeta,
  };
}) satisfies PageLoad;

export const prerender = false;
