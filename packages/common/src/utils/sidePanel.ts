import browser from 'webextension-polyfill';

/**
 * Detects presence of chrome.sidePanel.onOpened and chrome.sidePanel.onClosed events,
 * which are only available since Chrome 141 for "onOpened" and Chrome 142 (or later) for "onClosed".
 */
export const supportsSidePanelLifecycleEvents = () => {
  return (
    isSidePanelSupported() &&
    Boolean(browser.sidePanel.onOpened && browser.sidePanel.onClosed)
  );
};

export const isSidePanelSupported = () => {
  return Boolean(browser.sidePanel);
};
