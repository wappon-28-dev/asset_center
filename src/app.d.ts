/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference types="@sveltejs/kit" />
/// <reference types="@cloudflare/workers-types" />

declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  interface Platform {
    env: {
      ASSETS_CENTER_TOKENS: KVNamespace;
    };
  }
}
