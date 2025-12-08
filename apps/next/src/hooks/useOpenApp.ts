import { useConnectionContext, useSettingsContext } from '@core/ui';
import { useCallback } from 'react';
import { ExtensionRequest, ViewMode } from '@core/types';
import { OpenExtensionPopupWindowHandler } from '~/services/onboarding/handlers/openExtensionPopupWindow';
import browser from 'webextension-polyfill';

const viewInSidePanel = async () => {
  const currentWindow = await browser.windows.getCurrent({ populate: true });
  if (currentWindow?.id) {
    await browser.sidePanel.open({
      windowId: currentWindow.id,
    });
  }
};

export const useOpenApp = () => {
  const { preferredView } = useSettingsContext();
  const { request } = useConnectionContext();

  return useCallback(
    async ({
      closeWindow = true,
      viewMode,
    }: {
      closeWindow?: boolean;
      viewMode?: ViewMode;
    }) => {
      const viewToOpen = viewMode || preferredView;

      if (viewToOpen === 'sidebar') {
        await viewInSidePanel();
      } else {
        request<OpenExtensionPopupWindowHandler>({
          method: ExtensionRequest.OPEN_EXTENSION_POPUP_WINDOW,
        });
      }

      if (closeWindow) {
        window.close();
      }
    },
    [preferredView, request],
  );
};
