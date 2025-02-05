import { singleton } from 'tsyringe';
import EventEmitter from 'events';

import type {
  OnLock,
  OnUnlock,
} from '@src/background/runtime/lifecycleCallbacks';

import type { StorageService } from '../storage/StorageService';
import type { CurrencyExchangeRatesState } from './models';
import {
  CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL,
  CURRENCY_EXCHANGE_RATES_STORAGE_KEY,
  CURRENCY_EXCHANGE_RATES_URL,
  CurrencyServiceEvents,
  ExchangeRatesSchema,
} from './models';

@singleton()
export class CurrencyService implements OnLock, OnUnlock {
  #intervalId: NodeJS.Timeout | null = null;
  #timerId: NodeJS.Timeout | null = null;

  state: CurrencyExchangeRatesState | null = null;

  #eventEmitter = new EventEmitter();

  constructor(private storageService: StorageService) {}

  onLock() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }
    if (this.#timerId) {
      clearTimeout(this.#timerId);
    }
  }

  async onUnlock() {
    this.#initializeFromStorage();
    await this.#updateExchangeRates();
    this.#scheduleUpdates();
  }

  #scheduleUpdates() {
    this.#intervalId = setInterval(
      () => this.#updateExchangeRates(),
      CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL,
    );
  }

  async #initializeFromStorage() {
    const cachedState =
      await this.storageService.loadUnencrypted<CurrencyExchangeRatesState>(
        CURRENCY_EXCHANGE_RATES_STORAGE_KEY,
      );

    // Only use the cached state if we don't have the data from API yet
    if (cachedState && !this.state) {
      this.state = cachedState;
      this.#eventEmitter.emit(
        CurrencyServiceEvents.RatesUpdated,
        cachedState.rates,
      );
    }
  }

  async #updateExchangeRates() {
    try {
      const response = await fetch(CURRENCY_EXCHANGE_RATES_URL);
      const data = await response.json();
      const validationResult = ExchangeRatesSchema.validate(data);
      if (validationResult.error) {
        throw new Error('Invalid exchange rate list format');
      }
      const { date, ...rates } = data;

      this.state = {
        date,
        rates,
      };
      this.#eventEmitter.emit(CurrencyServiceEvents.RatesUpdated, rates);
      this.storageService.saveUnencrypted<CurrencyExchangeRatesState>(
        CURRENCY_EXCHANGE_RATES_STORAGE_KEY,
        this.state,
      );
    } catch (_err) {
      // If it fails (i.e. remote service is unreachable), schedule another request in 30 seconds.
      this.#timerId = setTimeout(() => this.#updateExchangeRates(), 30 * 1000);
    }
  }

  addListener(event: CurrencyServiceEvents, callback: (data: unknown) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
