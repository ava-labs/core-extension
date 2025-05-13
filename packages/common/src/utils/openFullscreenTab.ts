import { tabs } from 'webextension-polyfill';

export const openFullscreenTab = (url: string) => {
  tabs.create({
    url: `/fullscreen.html#/${url}`,
  });
};
