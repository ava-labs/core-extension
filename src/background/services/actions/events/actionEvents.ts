import { ActionsService } from '../ActionsService';
import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { ActionCompletedEventType, Actions, ActionsEvent } from '../models';
import { serializeError } from 'eth-rpc-errors';
import browser from 'webextension-polyfill';

@injectable()
export class ActionEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private actionService: ActionsService) {
    this.actionService.addListener(
      ActionsEvent.ACTION_COMPLETED,
      ({ type, action, result }) => {
        if (
          action.tabId === this._connectionInfo?.tabId ||
          action.site?.tabId === this._connectionInfo?.tabId ||
          this._connectionInfo?.domain === browser.runtime.id
        ) {
          const response =
            type === ActionCompletedEventType.ERROR
              ? {
                  ...action,
                  error: serializeError(result),
                }
              : { ...action, result: result };
          this.eventEmitter.emit('update', response);
        }
      },
    );
    this.actionService.addListener(
      ActionsEvent.ACTION_UPDATED,
      (actions: Actions) => {
        this.eventEmitter.emit('update', {
          name: ActionsEvent.ACTION_UPDATED,
          value: actions,
        });
      },
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
