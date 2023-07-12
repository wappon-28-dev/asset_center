import type { ParamMatcher } from "@sveltejs/kit";
export const match = ((param) =>
  /^public$|^protected$/.test(param)) satisfies ParamMatcher;
