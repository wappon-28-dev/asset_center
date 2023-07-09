import { writable } from "svelte/store";

export const isLoading = writable(true);
export const isBusy = writable(false);
export const isLandscape = writable(false);

export const loadedBytes = writable<number | undefined>(undefined);
