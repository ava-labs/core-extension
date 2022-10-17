/// <reference types="react-scripts" />

// workaround until TS 4.6
// https://github.com/denoland/deno/issues/12754
declare global {
  interface Crypto {
    randomUUID: () => string;
    getRandomValues: <T extends ArrayBufferView | null>(array: T) => T;
  }
}

export {};
