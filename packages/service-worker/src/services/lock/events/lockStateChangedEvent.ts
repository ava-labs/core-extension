import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';
import { LockEvents } from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { OnLock, OnUnlock } from '../../../runtime/lifecycleCallbacks';

@singleton()
export class LockStateChangedEvents
  implements ExtensionEventEmitter, OnLock, OnUnlock
{
  private eventEmitter = new EventEmitter();

  onLock(): void | Promise<void> {
    this.eventEmitter.emit('update', {
      name: LockEvents.LOCK_STATE_CHANGED,
      value: true,
    });
  }

  onUnlock(): void | Promise<void> {
    this.eventEmitter.emit('update', {
      name: LockEvents.LOCK_STATE_CHANGED,
      value: false,
    });
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
