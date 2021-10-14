import { Tabs, Windows } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';

const NOTIFICATION_WIDTH = 500;
const NOTIFICATION_HEIGHT = 500;
const contextToOpenIn = ContextContainer.CONFIRM;
/**
 * Fired when a window is removed (closed).
 */
const windowRemovedSignal = new Subject<number>();

/**
 * Fired when the currently focused window changes. Returns chrome.windows.WINDOW_ID_NONE if
 * all Chrome windows have lost focus. Note: On some Linux window managers, WINDOW_ID_NONE is
 * always sent immediately preceding a switch from one Chrome window to another.
 */
const windowFocusChangedSignal = new Subject<number>();

/**
 * Pipe the two events blow into the matching signal. This way we dont create a bunch of listeners
 */
extension.windows.onRemoved.addListener((windowId: number) => {
  windowRemovedSignal.next(windowId);
});

extension.windows.onFocusChanged.addListener((windowId: number) => {
  windowFocusChangedSignal.next(windowId);
});

/**
 * Since we cant get direct events from the window we have to rely on a global events that a window has been
 * closed. Each window or tab created then returns a config with a listener on the global events. The listener
 * filters by the windowId tied to the event. Once that is reached then the consumer is notified and can act accordingly
 *
 * @param info the window configs used to create the window
 * @returns
 */
function createWindowInfoAndEvents(info: Windows.Window) {
  return {
    ...info,
    removed: windowRemovedSignal.pipe(
      filter((windowId) => windowId === info.id)
    ),
    focusChanged: windowRemovedSignal.pipe(
      filter((windowId) => windowId === info.id)
    ),
  };
}

const checkForError = () => {
  const { lastError } = extension.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
};

export const openNewTab = (options: { url: string; selected?: boolean }) => {
  return new Promise((resolve, reject) => {
    extension.tabs.create(options, (newTab: Tabs.Tab) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(newTab);
    });
  });
};

export const openWindow = (options: Windows.CreateCreateDataType) => {
  return new Promise<ReturnType<typeof createWindowInfoAndEvents>>(
    (resolve, reject) => {
      extension.windows.create(options, (newWindow: Windows.Window) => {
        return resolve(createWindowInfoAndEvents(newWindow));
      });
    }
  );
};

export const getTabs = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return extension.tabs.query((tabs: Tabs.Tab) => {});
};

export const openExtensionInBrowser = (route = null, queryString = null) => {
  let extensionURL = extension.runtime.getURL(contextToOpenIn);

  if (queryString) {
    extensionURL += `?${queryString}`;
  }

  if (route) {
    extensionURL += `#${route}`;
  }

  return openNewTab({ url: extensionURL });
};

export const openExtensionNewWindow = (
  route?: string,
  queryString?: string
) => {
  let extensionURL = extension.runtime.getURL(contextToOpenIn);

  if (queryString) {
    extensionURL += `?${queryString}`;
  }

  if (route) {
    extensionURL += `#/${route}`;
  }

  let left = 0;
  let top = 0;

  const { width, height } = window.screen;

  top = Math.max(height, 0);
  left = Math.max(width + (width - NOTIFICATION_WIDTH), 0);
  return openWindow({
    url: extensionURL,
    focused: true,
    type: 'popup',
    height: NOTIFICATION_HEIGHT,
    width: NOTIFICATION_WIDTH,
    left,
    top,
  });
};

export const reload = () => {
  extension.runtime.reload();
};

export default {
  openNewTab,
  openWindow,
  openExtensionInBrowser,
  openExtensionNewWindow,
  getTabs,
};
