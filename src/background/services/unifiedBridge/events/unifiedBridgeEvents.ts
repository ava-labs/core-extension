import { singleton } from 'tsyringe';
import { EventEmitter } from 'events';

import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';

import { UnifiedBridgeService } from '../UnifiedBridgeService';
import { UnifiedBridgeEvent } from '../models';

@singleton()
export class UnifiedBridgeEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private unifiedBridgeService: UnifiedBridgeService) {
    this.unifiedBridgeService.addListener(
      UnifiedBridgeEvent.StateUpdated,
      (state) => {
        this.eventEmitter.emit('update', {
          name: UnifiedBridgeEvent.StateUpdated,
          value: state,
        });
      },
    );

    this.unifiedBridgeService.addListener(
      UnifiedBridgeEvent.TransferStepChange,
      (state) => {
        this.eventEmitter.emit('update', {
          name: UnifiedBridgeEvent.TransferStepChange,
          value: state,
        });
      },
    );

    this.unifiedBridgeService.addListener(
      UnifiedBridgeEvent.AssetsUpdated,
      (assets) => {
        this.eventEmitter.emit('update', {
          name: UnifiedBridgeEvent.AssetsUpdated,
          value: assets,
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
