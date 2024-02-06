/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference types="@sveltejs/kit" />

import type { GetDefaultDataMessage } from "microcms-field-extension-api";

declare global {
  declare namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
  }

  interface Window {
    microcmsIframeInitEvent: GetDefaultDataMessage;
  }
  declare let window: Window;
}
