import { BridgeService } from '@src/background/services/bridge/BridgeService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { WalletService } from '@src/background/services/wallet/WalletService';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { MessageType } from '../messages/models';
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
import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { ethErrors } from 'eth-rpc-errors';

@singleton()
export class ActionsService {
  private eventEmitter = new EventEmitter();
  constructor(
    private storageService: StorageService,
    private walletService: WalletService,
    private bridgeService: BridgeService
  ) {}

  async getActions(): Promise<Actions> {
    return (await this.storageService.load<Actions>(ACTIONS_STORAGE_KEY)) ?? {};
  }

  async saveActions(actions: Actions) {
    await this.storageService.save<Actions>(ACTIONS_STORAGE_KEY, actions);
    this.eventEmitter.emit(ActionsEvent.ACTION_UPDATED, actions);
  }

  async addAction(action: Action): Promise<Action> {
    const pendingAction: Action = {
      ...action,
      time: new Date().getTime(),
      status: ActionStatus.PENDING,
    };

    const currentPendingActions = await this.getActions();

    this.saveActions({
      ...currentPendingActions,
      [`${action.id}`]: pendingAction,
    });

    return pendingAction;
  }

  async removeAction(id: string) {
    const currentPendingActions = await this.getActions();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [`${id}`]: _removed, ...txs } = currentPendingActions;
    this.saveActions(txs);
  }

  emitResult(id: string, action: Action, isSuccess: boolean, result: any) {
    this.removeAction(id);

    this.eventEmitter.emit(ActionsEvent.ACTION_COMPLETED, {
      type: isSuccess
        ? ActionCompletedEventType.COMPLETED
        : ActionCompletedEventType.ERROR,
      action: action,
      result,
    });
  }

  async updateAction({ status, id, result, error }: ActionUpdate) {
    const currentPendingActions = await this.getActions();
    const pendingMessage = currentPendingActions[id];

    if (!pendingMessage) {
      return;
    }

    if (status === ActionStatus.SUBMITTING) {
      if (
        pendingMessage.method === DAppProviderRequest.AVALANCHE_BRIDGE_ASSET
      ) {
        const { currentBlockchain, amountStr, asset } =
          pendingMessage.displayData;
        const denomination = asset.denomination;

        this.bridgeService
          .transferAsset(
            currentBlockchain,
            bnToBig(stringToBN(amountStr, denomination), denomination),
            asset
          )
          .then(async (result) => {
            this.emitResult(id, pendingMessage, true, result);
          })
          .catch((error) => {
            this.emitResult(id, pendingMessage, false, error);
          });
      } else {
        this.walletService
          .signMessage(
            pendingMessage.method as MessageType,
            pendingMessage.displayData.data
          )
          .then(async (result) => {
            this.emitResult(id, pendingMessage, true, result);
          })
          .catch(async (err) => {
            this.emitResult(id, pendingMessage, false, err);
          });
      }
    } else if (
      status !== ActionStatus.COMPLETED &&
      status !== ActionStatus.ERROR &&
      status !== ActionStatus.ERROR_USER_CANCELED
    ) {
      this.saveActions({
        ...currentPendingActions,
        [id]: {
          ...pendingMessage,
          status,
          result,
          error,
        },
      });
    } else {
      if (status === ActionStatus.COMPLETED) {
        this.emitResult(id, pendingMessage, true, true);
      } else if (status === ActionStatus.ERROR_USER_CANCELED) {
        this.emitResult(
          id,
          pendingMessage,
          false,
          ethErrors.provider.userRejectedRequest()
        );
      } else {
        this.emitResult(id, pendingMessage, false, {
          message: status,
        });
      }
    }
  }

  addListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  removeListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.off(event, callback);
  }
}
