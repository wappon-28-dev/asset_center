import type { InferResponseType } from "hono";
import { client } from "$lib/model/service/client";
import type { PageLoad } from "./$types";
import { getAuthHeader } from "$lib/model/constants";
import { PUBLIC_BASE_ORIGIN } from "$env/static/public";

export const load = (async ({ params }) => {
  const { path: dirPath, key } = params;
  const apiGetChildren = client.v1.assets[":key"].children.$get;

  async function getChildren(): Promise<
    InferResponseType<typeof apiGetChildren>
  > {
    const res = await apiGetChildren(
      {
        param: { key },
        // @ts-expect-error: Hono のバグかも...？
        query: { dirPath },
      },
      {
        headers: {
          authorization: getAuthHeader("download", key),
          referer: PUBLIC_BASE_ORIGIN,
        },
      },
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return await res.json();
  }

  return { getChildren };
}) satisfies PageLoad;

export const prerender = false;
