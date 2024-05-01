import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import browser from 'webextension-polyfill';

import { openExtensionNewWindow } from '@src/utils/extensionUtils';

import { Action } from '../actions/models';
import { ActionsService } from '../actions/ActionsService';
import { ApprovalEvent } from './models';

@singleton()
export class ApprovalService {
  #eventEmitter = new EventEmitter();

  constructor(private actionsService: ActionsService) {}

  async requestApproval(action: Action, route: string) {
    const isInAppRequest = action.site?.domain === browser.runtime.id;
    const url = `${route}?actionId=${action.actionId}`;

    if (isInAppRequest) {
      this.#eventEmitter.emit(ApprovalEvent.ApprovalRequested, {
        action,
        url,
      });

      await this.actionsService.addAction(action);
    } else {
      // By having this extension window render here, we are popping the extension window before we send the completed request
      // allowing the locked service to prompt the password input first, saving the previous request to be completed once logged in.
      const windowData = await openExtensionNewWindow(url);

      await this.actionsService.addAction({
        ...action,
        popupWindowId: windowData.id,
      });
    }
  }

  addListener(event: string, callback: (data) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
