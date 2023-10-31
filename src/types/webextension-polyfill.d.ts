import '@types/webextension-polyfill';

// Workaround until missing storage.session gets resolved:
// https://github.com/mozilla/webextension-polyfill/issues/424

declare module 'webextension-polyfill' {
  namespace Storage {
    interface Static {
      session: StorageArea;
    }
  }
}
