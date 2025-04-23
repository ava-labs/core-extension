import { Browser, detect } from 'detect-browser';

export const supportedBrowsers: Browser[] = ['chrome'];
export const isSupportedBrowser = () => {
  const browser = detect();
  const isSupported = supportedBrowsers.includes(
    (browser?.name ?? '') as Browser,
  );

  return isSupported;
};
