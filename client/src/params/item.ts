import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param) => /.+\..+$/.test(param)) satisfies ParamMatcher;
