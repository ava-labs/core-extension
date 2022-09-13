import { ActionsService } from '@src/background/services/actions/ActionsService';
import { Action } from '@src/background/services/actions/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { container } from 'tsyringe';
import { ExtensionRequest } from '../extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';

export interface DAppRequestHandler {
  /**
   * Optional: Only used when the action needs user approval
   * IS ONLY called when `actionsService.addAction` and a `DEFERRED_RESPONSE` is used by the handler.
   * Called by the ActionsService after the user confirms the request on the approval popup.
   */
  onActionApproved?: (
    pendingAction: Action,
    result: any,
    onSuccess: (result: unknown) => Promise<void>,
    onError: (error: Error) => Promise<void>
  ) => Promise<void>;
}

export abstract class DAppRequestHandler<T extends ExtensionRequest = any> {
  abstract methods: string[];

  abstract handleAuthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T, any>>;

  abstract handleUnauthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T, any>>;

  /**
   * Opens approval window with the specified url and saves the action info to the Actions service
   * When singleton is true, it makes sure there is only one approval window at a time for the given domain with the requested method
   * @param action The action requiring approval
   * @param url The url of the approval window. Withouth a leading `/`
   */
  async openApprovalWindow(action: Action, url: string) {
    // using direct injection instead of the constructor to prevent circular dependencies
    const actionsService = container.resolve(ActionsService);

    // By having this extension window render here, we are popping the extension window before we send the completed request
    // allowing the locked service to prompt the password input first, saving the previous request to be completed once logged in.
    const windowData = await openExtensionNewWindow(url, '');

    await actionsService.addAction({
      ...action,
      popupWindowId: windowData.id,
    });
  }
}
