import browser, { Windows } from 'webextension-polyfill';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContextContainer } from '@core/types';

const NOTIFICATION_WIDTH = 320;
const NOTIFICATION_HEIGHT = 668;
const WINDOWS_SCROLLBAR_WIDTH = 26;
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
browser.windows.onRemoved.addListener((windowId: number) => {
  windowRemovedSignal.next(windowId);
});

browser.windows.onFocusChanged.addListener((windowId: number) => {
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
      filter((windowId) => windowId === info.id),
    ),
    focusChanged: windowRemovedSignal.pipe(
      filter((windowId) => windowId === info.id),
    ),
  };
}

const checkForError = () => {
  const { lastError } = browser.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error('Something went wrong.');
};

export const openNewTab = async (options: {
  url: string;
  selected?: boolean;
}) => {
  try {
    const tab = await browser.tabs.create(options);
    const error = checkForError();
    if (error) {
      throw new Error(error.message);
    }
    return tab;
  } catch (error) {
    return error;
  }
};

export const openWindow = async (options: Windows.CreateCreateDataType) => {
  try {
    const newWindow = await browser.windows.create(options);
    return createWindowInfoAndEvents(newWindow);
  } catch (error) {
    console.error(error);
    throw new Error('failed to open new window');
  }
};

export const openPopup = async ({
  url,
  setSelfAsOpener = false,
  top = 0,
  right = 0,
}) => {
  const platform = await browser.runtime.getPlatformInfo();

  const isPlatformWindows = platform?.os === 'win';
  let left = 0;
  try {
    const lastFocused = await browser.windows.getLastFocused();
    // Position window in top right corner of lastFocused window.
    top = lastFocused.top ? lastFocused.top + top : 0;
    left =
      typeof lastFocused.left === 'number' &&
      typeof lastFocused.width === 'number'
        ? lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH) - right
        : 0;
  } catch (_) {
    // do nothing, don't know where the last window is so let's just place it to 0,0
  }

  return openWindow({
    url,
    focused: true,
    setSelfAsOpener,
    type: 'popup',
    height: !isPlatformWindows
      ? NOTIFICATION_HEIGHT
      : NOTIFICATION_HEIGHT + WINDOWS_SCROLLBAR_WIDTH,
    width: !isPlatformWindows
      ? NOTIFICATION_WIDTH
      : NOTIFICATION_WIDTH + WINDOWS_SCROLLBAR_WIDTH,
    left,
    top,
  });
};

export const openExtensionNewWindow = async (
  route?: string,
  queryString?: string,
) => {
  let extensionURL = browser.runtime.getURL(contextToOpenIn);

  if (queryString) {
    extensionURL += `?${queryString}`;
  }

  if (route) {
    extensionURL += `#/${route}`;
  }

  return openPopup({
    url: extensionURL,
  });
};

export const reload = () => {
  browser.runtime.reload();
};
