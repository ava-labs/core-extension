import { BtcTxUpdateFn, EvmTxUpdateFn } from '@avalabs/vm-module-types';
import {
  Action,
  ACTION_HANDLED_BY_MODULE,
  ActionCompletedEventType,
  Actions,
  ACTIONS_STORAGE_KEY,
  ActionsEvent,
  ActionStatus,
  ActionUpdate,
  DAppProviderRequest,
  DAppRequestHandler,
  isBatchApprovalAction,
  MultiTxAction,
} from '@core/types';
import { getUpdatedSigningData } from '@core/common';
import browser from 'webextension-polyfill';
import { ethErrors } from 'eth-rpc-errors';
import { EventEmitter } from 'events';
import { omit } from 'lodash';
import { injectAll, singleton } from 'tsyringe';
import { OnStorageReady } from '../../runtime/lifecycleCallbacks';
import { ApprovalController } from '../../vmModules/ApprovalController';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { filterStaleActions, getActionDomain, getActionTabId } from './utils';

@singleton()
export class ActionsService implements OnStorageReady {
  private eventEmitter = new EventEmitter();

  constructor(
    @injectAll('DAppRequestHandler')
    private dAppRequestHandlers: DAppRequestHandler[],
    private storageService: StorageService,
    private lockService: LockService,
    private approvalController: ApprovalController,
  ) {}

  async onStorageReady() {
    const acionsInSession =
      await this.storageService.loadFromSessionStorage<Actions>(
        ACTIONS_STORAGE_KEY,
      );
    const actionsInStorage = await this.getActions();
    this.storageService.removeFromSessionStorage(ACTIONS_STORAGE_KEY);

    this.saveActions({
      ...acionsInSession,
      ...(await filterStaleActions(actionsInStorage)),
    });
  }

  async getActions(): Promise<Actions> {
    const sessionStorageActions =
      (await this.storageService.loadFromSessionStorage<Actions>(
        ACTIONS_STORAGE_KEY,
      )) ?? {};
    if (this.lockService.locked) {
      return sessionStorageActions;
    } else {
      // When unlocked, we need to get actions from sessionStorage and storage because when wallet is locked, we store action in sessionStorage
      return {
        ...sessionStorageActions,
        ...((await this.storageService.load<Actions>(ACTIONS_STORAGE_KEY)) ??
          {}),
      };
    }
  }

  async saveActions(actions: Actions) {
    // when the wallet is locked, temporarily save actions to the session storage
    // temporary actions get moved to the permament storage on unlock
    if (this.lockService.locked) {
      await this.storageService.saveToSessionStorage<Actions>(
        ACTIONS_STORAGE_KEY,
        actions,
      );
    } else {
      await this.storageService.save<Actions>(ACTIONS_STORAGE_KEY, actions);
    }
    this.eventEmitter.emit(ActionsEvent.ACTION_UPDATED, actions);
  }

  async addAction(
    action: Action | MultiTxAction,
  ): Promise<Action | MultiTxAction> {
    const pendingAction: Action | MultiTxAction = {
      ...action,
      time: Date.now(),
      status: ActionStatus.PENDING,
    };

    const currentPendingActions = await this.getActions();

    // SECURITY: actions are keyed by `actionId`, so writing over an existing
    // key would swap out the payload behind an approval the user may already be
    // looking at (a benign-looking prompt submitting a different cached
    // request). Ids are minted by trusted code with `crypto.randomUUID()`, so a
    // collision here is never legitimate.
    if (!action.actionId) {
      throw new Error('Cannot add an action without an id');
    }

    if (currentPendingActions[action.actionId]) {
      throw new Error(`An action with id ${action.actionId} already exists`);
    }

    this.saveActions({
      ...currentPendingActions,
      [`${action.actionId}`]: pendingAction,
    });

    return pendingAction;
  }

  async removeAction(id: string) {
    const currentPendingActions = await this.getActions();

    const { [`${id}`]: _removed, ...txs } = currentPendingActions;
    await this.saveActions(txs);
  }

  // Cancel all pending actions for a given connection (tabId + domain)
  async cancelPendingActionsForConnection({
    tabId,
    domain,
  }: {
    tabId?: number;
    domain?: string;
  }): Promise<void> {
    // Both are required: matching on the tab alone would let one frame cancel
    // another origin's approval in the same tab.
    if (typeof tabId !== 'number' || !domain) {
      return;
    }

    const actions = await this.getActions();
    const abandoned = Object.entries(actions).filter(
      ([, action]) =>
        action.status === ActionStatus.PENDING &&
        getActionTabId(action) === tabId &&
        getActionDomain(action) === domain,
    );

    for (const [id, action] of abandoned) {
      await this.updateAction({
        id,
        status: ActionStatus.ERROR_USER_CANCELED,
      });

      if (typeof action.popupWindowId === 'number') {
        // The window is now showing an approval that can never complete.
        await browser.windows.remove(action.popupWindowId).catch(() => {
          // Already closed by the user - nothing to clean up.
        });
      }
    }
  }

  async emitResult(
    id: string,
    action: Action | MultiTxAction,
    isSuccess: boolean,
    result: any,
  ) {
    await this.removeAction(id);

    // We dont want display data to be emitted. Sometimes it can be not serialized and it's content is internal to Core
    const actionWithoutDisplayData = isBatchApprovalAction(action)
      ? {
          ...action,
          signingRequests: action.signingRequests.map((req) =>
            omit(req, 'displayData'),
          ),
        }
      : omit(action, 'displayData');

    this.eventEmitter.emit(ActionsEvent.ACTION_COMPLETED, {
      type: isSuccess
        ? ActionCompletedEventType.COMPLETED
        : ActionCompletedEventType.ERROR,
      action: actionWithoutDisplayData,
      result,
    });
  }

  async updateAction({
    status,
    id,
    result,
    error,
    displayData,
    signingData,
    tabId,
  }: ActionUpdate) {
    const currentPendingActions = await this.getActions();
    const pendingMessage = currentPendingActions[id];
    if (!pendingMessage) {
      return;
    }

    // SECURITY: the marker alone is not proof the action came from a VM module -
    // only that it is set on the stored action. Confirm the ApprovalController
    // actually owns this id before handing it the approval, so a request that
    // merely claims to be module-handled cannot bypass its real handler.
    const isHandledByModule =
      pendingMessage[ACTION_HANDLED_BY_MODULE] &&
      this.approvalController.ownsAction(pendingMessage.actionId);

    if (status === ActionStatus.SUBMITTING && isHandledByModule) {
      await this.approvalController.onApproved(pendingMessage);
      await this.removeAction(id);
    } else if (status === ActionStatus.SUBMITTING) {
      const handler = this.dAppRequestHandlers.find((h) =>
        h.methods.includes(pendingMessage.method as DAppProviderRequest),
      );

      if (!handler || !handler.onActionApproved) {
        await this.emitResult(
          id,
          pendingMessage,
          false,
          ethErrors.rpc.internal('Request handler not found'),
        );
        return;
      }

      await handler.onActionApproved(
        pendingMessage as Action,
        result,
        async (successResult) => {
          await this.emitResult(id, pendingMessage, true, successResult);
        },
        async (failureResult) => {
          await this.emitResult(id, pendingMessage, false, failureResult);
        },
        tabId,
      );
    } else if (status === ActionStatus.ERROR) {
      await this.emitResult(
        id,
        pendingMessage,
        false,
        ethErrors.rpc.internal(error),
      );
    } else if (status === ActionStatus.COMPLETED) {
      await this.emitResult(id, pendingMessage, true, result ?? true);
    } else if (
      status === ActionStatus.ERROR_USER_CANCELED &&
      isHandledByModule
    ) {
      await this.approvalController.onRejected(pendingMessage);
      await this.removeAction(id);
    } else if (status === ActionStatus.ERROR_USER_CANCELED) {
      await this.emitResult(
        id,
        pendingMessage,
        false,
        ethErrors.provider.userRejectedRequest(),
      );
    } else {
      if (isBatchApprovalAction(pendingMessage)) {
        await this.saveActions({
          ...currentPendingActions,
          [id]: {
            ...pendingMessage,
            signingRequests: pendingMessage.signingRequests,
            status,
            result,
            error,
          },
        });
      } else {
        await this.saveActions({
          ...currentPendingActions,
          [id]: {
            ...pendingMessage,
            displayData: {
              ...pendingMessage.displayData,
              ...displayData,
            },
            signingData: getUpdatedSigningData(
              pendingMessage.signingData,
              signingData,
            ),
            status,
            result,
            error,
          },
        });
      }
    }
  }

  async updateTx(
    id: string,
    newData: Parameters<EvmTxUpdateFn>[0] | Parameters<BtcTxUpdateFn>[0],
    txIndex?: number,
  ) {
    const currentPendingRequests = await this.getActions();
    const pendingRequest = currentPendingRequests[id];

    if (!pendingRequest) {
      throw new Error(`No request found with id: ${id}`);
    }

    if (isBatchApprovalAction(pendingRequest)) {
      if (
        (!('maxFeeRate' in newData) && !('maxTipRate' in newData)) ||
        typeof txIndex !== 'number'
      ) {
        return;
      }

      const { displayData, signingRequests } =
        this.approvalController.updateTxInBatch(
          pendingRequest,
          newData,
          txIndex,
        );

      await this.saveActions({
        ...currentPendingRequests,
        [id]: {
          ...pendingRequest,
          signingRequests,
          displayData,
        },
      });
    } else {
      const { signingData, displayData } = this.approvalController.updateTx(
        pendingRequest,
        newData,
      );

      await this.saveActions({
        ...currentPendingRequests,
        [id]: {
          ...pendingRequest,
          signingData,
          displayData,
        },
      });
    }
  }

  addListener(
    event: ActionsEvent.ACTION_COMPLETED,
    callback: (data: {
      type: ActionCompletedEventType;
      action: Action;
      result: any;
    }) => void,
  );
  addListener(
    event: ActionsEvent.ACTION_UPDATED,
    callback: (actions: Actions) => void,
  );
  addListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  removeListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.off(event, callback);
  }
}
