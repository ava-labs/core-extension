import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  NavigationHistoryEvents,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NavigationHistoryService } from '../NavigationHistoryService';

@singleton()
export class NavigationRequestEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private navigationHistoryService: NavigationHistoryService) {
    this.navigationHistoryService.addListener<{ path: string }>(
      NavigationHistoryEvents.NAVIGATION_HISTORY_REQUEST_NAVIGATION_EVENT,
      (data) => {
        this.eventEmitter.emit('update', {
          name: NavigationHistoryEvents.NAVIGATION_HISTORY_REQUEST_NAVIGATION_EVENT,
          value: data,
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
