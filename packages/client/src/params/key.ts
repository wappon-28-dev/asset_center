import type { ParamMatcher } from "@sveltejs/kit";
import { getAssetsManifests } from "$lib/model/constants";

export const match = ((param) =>
  param in getAssetsManifests()) satisfies ParamMatcher;
