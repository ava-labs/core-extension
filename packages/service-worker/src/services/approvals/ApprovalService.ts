import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { sidePanel, windows, runtime } from 'webextension-polyfill';

import { openExtensionNewWindow } from '@core/common';
import { Action, ApprovalEvent, MultiTxAction } from '@core/types';

import { ActionsService } from '../actions/ActionsService';
import { supportsSidePanelLifecycleEvents } from './utils/sidePanelUtils';

@singleton()
export class ApprovalService {
  #eventEmitter = new EventEmitter();

  #sidePanelWindowIds = new Set<number>();

  constructor(private actionsService: ActionsService) {
    if (supportsSidePanelLifecycleEvents()) {
      sidePanel.onOpened.addListener(({ windowId }) => {
        this.#sidePanelWindowIds.add(windowId);
      });
      sidePanel.onClosed.addListener(({ windowId }) => {
        this.#sidePanelWindowIds.delete(windowId);
      });
    }
  }

  #isInAppRequest(action: Action | MultiTxAction): boolean {
    if (action.site?.domain === runtime.id) {
      return true;
    }

    if (action.dappInfo) {
      const vmModuleDappUrl = new URL(action.dappInfo.url);
      return vmModuleDappUrl.hostname === runtime.id;
    }

    return false;
  }
  async requestApproval(
    action: Action | MultiTxAction,
    route: string,
  ): Promise<Action | MultiTxAction> {
    const url = `${route}?actionId=${action.actionId}`;

    const currentWindow = await windows.getCurrent();
    const isComingFromCurrentWindowWithSidePanelOpen =
      currentWindow.id && this.#sidePanelWindowIds.has(currentWindow.id);

    if (
      this.#isInAppRequest(action) ||
      isComingFromCurrentWindowWithSidePanelOpen
    ) {
      this.#eventEmitter.emit(ApprovalEvent.ApprovalRequested, {
        action: {
          ...action,
          windowId: currentWindow.id,
        },
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
