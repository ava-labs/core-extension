import { EventEmitter } from 'events';
import { injectAll, singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  Action,
  ActionCompletedEventType,
  Actions,
  ActionsEvent,
  ActionStatus,
  ACTIONS_STORAGE_KEY,
  ActionUpdate,
} from './models';
import { ethErrors } from 'eth-rpc-errors';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { LockService } from '../lock/LockService';
import { filterStaleActions } from './utils';
import { VIA_MODULE_SYMBOL } from '@src/background/vmModules/models';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';

@singleton()
export class ActionsService implements OnStorageReady {
  private eventEmitter = new EventEmitter();

  constructor(
    @injectAll('DAppRequestHandler')
    private dAppRequestHandlers: DAppRequestHandler[],
    private storageService: StorageService,
    private lockService: LockService
  ) {}

  async onStorageReady() {
    const acionsInSession =
      await this.storageService.loadFromSessionStorage<Actions>(
        ACTIONS_STORAGE_KEY
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
        ACTIONS_STORAGE_KEY
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
        actions
      );
    } else {
      await this.storageService.save<Actions>(ACTIONS_STORAGE_KEY, actions);
    }
    this.eventEmitter.emit(ActionsEvent.ACTION_UPDATED, actions);
  }

  async addAction(action: Action): Promise<Action> {
    const pendingAction: Action = {
      ...action,
      time: Date.now(),
      status: ActionStatus.PENDING,
    };

    const currentPendingActions = await this.getActions();

    this.saveActions({
      ...currentPendingActions,
      [`${action.actionId}`]: pendingAction,
    });

    return pendingAction;
  }

  async removeAction(id: string) {
    const currentPendingActions = await this.getActions();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [`${id}`]: _removed, ...txs } = currentPendingActions;
    await this.saveActions(txs);
  }

  async emitResult(
    id: string,
    action: Action,
    isSuccess: boolean,
    result: any
  ) {
    await this.removeAction(id);

    // We dont want display data to be emitted. Sometimes it can not be serialized and it's content is internal to Core
    // Make sure not to modify the original action object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { displayData, ...actionWithoutDisplayData } = action;

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

    const isHandledByModule = pendingMessage[VIA_MODULE_SYMBOL];

    if (isHandledByModule) {
      this.eventEmitter.emit(ActionsEvent.MODULE_ACTION_UPDATED, {
        action: pendingMessage,
        newStatus: status,
        error,
      });
    }

    if (status === ActionStatus.SUBMITTING && !isHandledByModule) {
      const handler = this.dAppRequestHandlers.find((h) =>
        h.methods.includes(pendingMessage.method as DAppProviderRequest)
      );

      if (!handler || !handler.onActionApproved) {
        await this.emitResult(
          id,
          pendingMessage,
          false,
          ethErrors.rpc.internal('Request handler not found')
        );
        return;
      }

      await handler.onActionApproved(
        pendingMessage,
        result,
        async (successResult) => {
          await this.emitResult(id, pendingMessage, true, successResult);
        },
        async (failureResult) => {
          await this.emitResult(id, pendingMessage, false, failureResult);
        },
        tabId
      );
    } else if (status === ActionStatus.ERROR) {
      await this.emitResult(
        id,
        pendingMessage,
        false,
        ethErrors.rpc.internal(error)
      );
    } else if (status === ActionStatus.COMPLETED) {
      await this.emitResult(id, pendingMessage, true, result ?? true);
    } else if (status === ActionStatus.ERROR_USER_CANCELED) {
      await this.emitResult(
        id,
        pendingMessage,
        false,
        ethErrors.provider.userRejectedRequest()
      );
    } else {
      await this.saveActions({
        ...currentPendingActions,
        [id]: {
          ...pendingMessage,
          displayData: {
            ...pendingMessage.displayData,
            ...displayData,
          },
          signingData: {
            ...pendingMessage.signingData,
            ...signingData,
          },
          status,
          result,
          error,
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
    }) => void
  );
  addListener(
    event: ActionsEvent.ACTION_UPDATED,
    callback: (actions: Actions) => void
  );
  addListener(
    event: ActionsEvent.MODULE_ACTION_UPDATED,
    callback: (data: {
      action: Action;
      newStatus: ActionStatus;
      error?: string;
    }) => void
  );
  addListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  removeListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.off(event, callback);
  }
}
