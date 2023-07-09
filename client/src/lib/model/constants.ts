import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { page } from "$app/stores";
import { get } from "svelte/store";
import type { PageManifest } from "./manifests";
import { isLoading } from "./store";

export type valueOf<T> = T[keyof T];
export type PickType<T, K extends keyof T> = T[K];

export const waitMs = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const runTransition = (to: PageManifest): void => {
  isLoading.set(true);
  const path = to.path;

  if (get(page).url.pathname === path) {
    isLoading.set(false);
    return;
  }

  void goto(base + path);
};

export const runTransitionRaw = async (to: string): Promise<void> => {
  isLoading.set(true);

  if (get(page).url.pathname === to) {
    isLoading.set(false);
    return;
  }

  await waitMs(100);
  void goto(base + to);
};

export const url = {
  repository: "https://github.com/wappon-28-dev/assets_center",
};

export function isLandscapeDetect(): boolean {
  return (
    navigator.userAgent.match(/iPhone|Android.+Mobile/) == null &&
    window.innerWidth > 730
  );
}

export function byteToUnit(bytes: number, digit = 2): string {
  const unit = [" ", " K", " M", " G", " T", " P"];
  let count = 0;
  while (bytes >= 1024 && count < unit.length) {
    bytes /= 1024;
    ++count;
  }
  return bytes.toFixed(digit) + unit[count] + "B";
}
