import { hc } from "hono/client";
import type { AppType } from "index";
import { PUBLIC_API_ENDPOINT } from "$env/static/public";

export const client = hc<AppType>(PUBLIC_API_ENDPOINT);
