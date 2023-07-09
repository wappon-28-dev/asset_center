import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import { hc } from "hono/client";
import type { AppType } from "index";

export const client = hc<AppType>(PUBLIC_API_ENDPOINT);
