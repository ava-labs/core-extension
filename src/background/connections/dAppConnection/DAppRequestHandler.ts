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

  async openApprovalWindow(action: Action, url: string) {
    // By having this extension window render here, we are popping the extension window before we send the completed request
    // allowing the locked service to prompt the password input first, saving the previous request to be completed once logged in.
    await openExtensionNewWindow(url, '', action.meta?.coords);

    // using direct injection instead of the constructor to prevent circular dependencies
    const actionsService = container.resolve(ActionsService);
    await actionsService.addAction(action);
  }
}
