import { kitchen } from "$lib/model/store";
import { get } from "svelte/store";

export type KitchenArgs = {
  props?: {
    variant?: "stacked";
    timeoutMs?: number;
    leading?: boolean;
  };
  label: string;
  actions?: Array<{
    onClick: () => void;
    text: string;
  }>;
  dismissButton: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: (e: any) => void;
};

export const pushSnackbar = (args: KitchenArgs): void => {
  get(kitchen).push(args);
};
