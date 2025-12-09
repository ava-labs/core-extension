import { useConnectionContext, useSettingsContext } from '@core/ui';
import { useCallback } from 'react';
import { ExtensionRequest, ViewMode } from '@core/types';
import { OpenExtensionPopupWindowHandler } from '~/services/onboarding/handlers/openExtensionPopupWindow';
import browser from 'webextension-polyfill';
import { RequestNavigationHandler } from '~/index';

type OpenAppParams = {
  closeWindow?: boolean;
  viewMode?: ViewMode;
  navigateTo?: {
    pathname: string;
    search?: string;
  };
};

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
    async ({ closeWindow = true, viewMode, navigateTo }: OpenAppParams) => {
      const viewToOpen = viewMode || preferredView;

      if (viewToOpen === 'sidebar') {
        try {
          await viewInSidePanel();
        } catch (error) {
          // can throw an error if the call is not triggered by user action
          console.warn('Failed to open side panel', error);
        }
        if (navigateTo) {
          request<RequestNavigationHandler>({
            method: ExtensionRequest.NAVIGATION_HISTORY_REQUEST_NAVIGATION,
            params: navigateTo,
          });
        }
      } else {
        request<OpenExtensionPopupWindowHandler>({
          method: ExtensionRequest.OPEN_EXTENSION_POPUP_WINDOW,
          params: {
            navigateTo,
          },
        });
      }

      if (closeWindow) {
        window.close();
      }
    },
    [preferredView, request],
  );
};
