import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { page } from "$app/stores";
import { get } from "svelte/store";
import type { PageManifest } from "./manifests";
import { isLoading } from "./store";

type valueOf<T> = T[keyof T];
type PickType<T, K extends keyof T> = T[K];

const waitMs = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const runTransition = (to: PageManifest): void => {
  isLoading.set(true);
  const path = to.path;

  if (get(page).url.pathname === path) {
    isLoading.set(false);
    return;
  }

  void goto(base + path);
};

const runTransitionRaw = async (to: string): Promise<void> => {
  isLoading.set(true);

  if (get(page).url.pathname === to) {
    isLoading.set(false);
    return;
  }

  await waitMs(100);
  void goto(base + to);
};

const url = {
  repository: "https://github.com/wappon-28-dev/assets_center",
};

function isLandscapeDetect(): boolean {
  return (
    navigator.userAgent.match(/iPhone|Android.+Mobile/) == null &&
    window.innerWidth > 730
  );
}

export { isLandscapeDetect, runTransition, runTransitionRaw, url, waitMs };
export type { PickType, valueOf };
