import '@types/webextension-polyfill';

// Workaround until missing storage.session gets resolved:
// https://github.com/mozilla/webextension-polyfill/issues/424

declare module 'webextension-polyfill' {
  type OnSidePanelOpenedEvent = {
    windowId: number;
  };
  type OnSidePanelClosedEvent = {
    windowId: number;
  };
  const sidePanel: typeof chrome.sidePanel & {
    onOpened: {
      addListener: (callback: (evt: OnSidePanelOpenedEvent) => void) => void;
      removeListener: (callback: (evt: OnSidePanelOpenedEvent) => void) => void;
    };
    onClosed: {
      addListener: (callback: (evt: OnSidePanelClosedEvent) => void) => void;
      removeListener: (callback: (evt: OnSidePanelClosedEvent) => void) => void;
    };
  };
  const offscreen: typeof chrome.offscreen;

  namespace Storage {
    interface Static {
      session: StorageArea;
    }
  }

  namespace Windows {
    interface CreateCreateDataType {
      /**
       * This is a part of Chrome's API, but it's not typed in webextension-polyfill.
       * Setting this option to true gives the popup the ability to communicate back
       * with us (i.e. via window.opener.postMessage).
       *
       * @see https://developer.chrome.com/docs/extensions/reference/api/windows#property-create-createData-setSelfAsOpener
       */
      setSelfAsOpener?: boolean;
    }
  }
}
