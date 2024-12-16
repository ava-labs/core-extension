import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';

import { ApprovalService } from '../ApprovalService';
import { ApprovalEvent } from '../models';

@singleton()
export class ApprovalEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private approvalService: ApprovalService) {
    this.approvalService.addListener(
      ApprovalEvent.ApprovalRequested,
      (value) => {
        this.eventEmitter.emit('update', {
          name: ApprovalEvent.ApprovalRequested,
          value,
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
