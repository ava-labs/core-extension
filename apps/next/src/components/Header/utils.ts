import { ViewMode } from '@core/types';
import browser from 'webextension-polyfill';

const viewInSidePanel = async () => {
  const currentWindow = await browser.windows.getCurrent({ populate: true });
  if (currentWindow?.id) {
    await browser.sidePanel.open({
      windowId: currentWindow.id,
    });
  }
};

const viewInPopup = async () => {
  await browser.action.openPopup({});
};

export const switchTo: Record<ViewMode, () => Promise<void>> = {
  sidebar: viewInSidePanel,
  floating: viewInPopup,
};
