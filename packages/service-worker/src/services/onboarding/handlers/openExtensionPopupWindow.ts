import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import browser from 'webextension-polyfill';
import { NavigationHistoryService } from '~/services/navigationHistory/NavigationHistoryService';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.OPEN_EXTENSION_POPUP_WINDOW,
  true,
  {
    navigateTo?: {
      path: string;
      search?: string;
    };
  }
>;

@injectable()
export class OpenExtensionPopupWindowHandler implements HandlerType {
  method = ExtensionRequest.OPEN_EXTENSION_POPUP_WINDOW as const;

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    // We open the popup window in the background to avoid window interactions
    // such as closing the parent tab close it immediately
    await browser.action.openPopup();

    if (request.params.navigateTo) {
      this.navigationHistoryService.requestNavigation(
        request.params.navigateTo.path,
        request.params.navigateTo.search,
      );
    }

    return {
      ...request,
      result: true,
    };
  };
}
