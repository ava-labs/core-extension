import { ActionsService } from './../ActionsService';
import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { ActionCompletedEventType, ActionsEvent } from '../models';

@injectable()
export class ActionCompletedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private actionService: ActionsService) {
    this.actionService.addListener(
      ActionsEvent.ACTION_COMPLETED,
      ({ type, action, result }) => {
        if (action.tabId === this._connectionInfo?.tabId) {
          const response =
            type === ActionCompletedEventType.ERROR
              ? { ...action, error: result }
              : { ...action, result: result };

          this.eventEmitter.emit('update', response);
        }
      }
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
