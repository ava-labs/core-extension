import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import browser from 'webextension-polyfill';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.OPEN_EXTENSION_POPUP_WINDOW,
  true
>;

@injectable()
export class OpenExtensionPopupWindowHandler implements HandlerType {
  method = ExtensionRequest.OPEN_EXTENSION_POPUP_WINDOW as const;

  handle: HandlerType['handle'] = async ({ request }) => {
    // We open the popup window in the background to avoid window interactions
    // such as closing the parent tab close it immediately
    await browser.action.openPopup();

    return {
      ...request,
      result: true,
    };
  };
}
