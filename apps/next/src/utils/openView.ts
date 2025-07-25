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

export const openView = async (mode: ViewMode) => {
  switch (mode) {
    case 'sidebar':
      await viewInSidePanel();
      break;
    case 'floating':
      await viewInPopup();
      break;
    default:
      throw new Error(`Unsupported view mode: ${mode}`);
  }
};
