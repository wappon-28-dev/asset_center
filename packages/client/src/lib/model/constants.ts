import { get } from "svelte/store";
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { page } from "$app/stores";
import type { PageManifest } from "./manifests";
import { isLoading } from "./store";
import type { AssetsManifests } from "./types/manifest";
import { PUBLIC_MANIFESTS } from "$env/static/public";

export type valueOf<T> = T[keyof T];
export type PickType<T, K extends keyof T> = T[K];

export const waitMs = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const runTransition = (to: PageManifest): void => {
  isLoading.set(true);
  const { path } = to;

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
  let _bytes = bytes;
  let count = 0;

  while (_bytes >= 1024 && count < unit.length) {
    _bytes /= 1024;
    count += 1;
  }
  return `${_bytes.toFixed(digit) + unit[count]}B`;
}

export function getAssetsManifests(): AssetsManifests {
  return JSON.parse(PUBLIC_MANIFESTS);
}

export function getAuthHeader(key: keyof AssetsManifests): string {
  const manifest = getAssetsManifests()[key];
  if (manifest == null) throw new Error("assets key not found");

  return `Bearer ${manifest.accessKey}`;
}
