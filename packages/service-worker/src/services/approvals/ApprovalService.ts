import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import browser from 'webextension-polyfill';

import { openExtensionNewWindow } from '@core/utils';
import { Action, ApprovalEvent, MultiTxAction } from '@core/types';

import { ActionsService } from '../actions/ActionsService';

@singleton()
export class ApprovalService {
  #eventEmitter = new EventEmitter();

  constructor(private actionsService: ActionsService) {}

  #isInAppRequest(action: Action | MultiTxAction): boolean {
    if (action.site?.domain === browser.runtime.id) {
      return true;
    }

    if (action.dappInfo) {
      const vmModuleDappUrl = new URL(action.dappInfo.url);
      return vmModuleDappUrl.hostname === browser.runtime.id;
    }

    return false;
  }
  async requestApproval(
    action: Action | MultiTxAction,
    route: string,
  ): Promise<Action | MultiTxAction> {
    const url = `${route}?actionId=${action.actionId}`;

    if (this.#isInAppRequest(action)) {
      this.#eventEmitter.emit(ApprovalEvent.ApprovalRequested, {
        action,
        url,
      });

      return this.actionsService.addAction(action);
    }

    // By having this extension window render here, we are popping the extension window before we send the completed request
    // allowing the locked service to prompt the password input first, saving the previous request to be completed once logged in.
    const windowData = await openExtensionNewWindow(url);

    return this.actionsService.addAction({
      ...action,
      popupWindowId: windowData.id,
    });
  }

  addListener(event: string, callback: (data) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
