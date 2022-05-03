import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  Action,
  Actions,
  ActionsEvent,
  ActionStatus,
  ACTIONS_STORAGE_KEY,
  ActionUpdate,
} from './models';

@singleton()
export class ActionsService {
  private eventEmitter = new EventEmitter();
  constructor(private storageService: StorageService) {}

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

  async updateAction({ status, id, result, error }: ActionUpdate) {
    const currentPendingActions = await this.getActions();

    if (
      status !== ActionStatus.COMPLETED &&
      status !== ActionStatus.ERROR &&
      status !== ActionStatus.ERROR_USER_CANCELED
    ) {
      const pendingMessage = currentPendingActions[id];
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [`${id}`]: _removed, ...txs } = currentPendingActions;
      this.saveActions(txs);
    }
  }

  addListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  removeListener(event: ActionsEvent, callback: (data: any) => void) {
    this.eventEmitter.off(event, callback);
  }
}
