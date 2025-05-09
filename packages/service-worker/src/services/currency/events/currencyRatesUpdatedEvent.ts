import { singleton } from 'tsyringe';
import { EventEmitter } from 'events';

import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  CurrencyServiceEvents,
} from '@core/types';

import { CurrencyService } from '../CurrencyService';

@singleton()
export class CurrencyRatesUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private currencyService: CurrencyService) {
    this.currencyService.addListener(
      CurrencyServiceEvents.RatesUpdated,
      (rates) => {
        this.eventEmitter.emit('update', {
          name: CurrencyServiceEvents.RatesUpdated,
          value: rates,
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
