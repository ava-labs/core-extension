import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { filter, map } from 'rxjs';

import { CurrencyExchangeRates } from 'packages/service-worker/src/services/currency/models';
import { currencyRatesUpdatedEventListener } from 'packages/service-worker/src/services/currency/events/listeners';

import { useConnectionContext } from './ConnectionProvider';
import { GetCurrencyExchangeRatesHandler } from 'packages/service-worker/src/services/currency/handlers/getCurrencyExchangeRates';
import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';

type CurrencyConversionOptions = {
  from: string;
  to: string;
  amount: number;
};

type CurrenciesProviderValue = {
  convert(options: CurrencyConversionOptions): number | null;
  getExchangeRate(from: string, to: string): number | null;
  hasExchangeRate(from: string, to: string): boolean;
};

const CurrenciesContext = createContext<CurrenciesProviderValue>(
  {} as unknown as CurrenciesProviderValue,
);

export function CurrenciesContextProvider({ children }) {
  const { request, events } = useConnectionContext();
  const [rates, setRates] = useState<CurrencyExchangeRates>({});

  useEffect(() => {
    request<GetCurrencyExchangeRatesHandler>({
      method: ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES,
    })
      .then((exchangeRates) => {
        setRates(exchangeRates);
      })
      .catch(() => {
        // do nothing, just handle the rejected promise
      });
  }, [request]);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(currencyRatesUpdatedEventListener),
        map((evt) => evt.value),
      )
      .subscribe((newRates) => {
        setRates(newRates);
      });

    return () => subscription.unsubscribe();
  }, [events, request]);

  const getExchangeRate = useCallback(
    (from: string, to: string): number | null => {
      return rates?.[from.toLowerCase()]?.[to.toLowerCase()] ?? null;
    },
    [rates],
  );

  const hasExchangeRate = useCallback(
    (from: string, to: string): boolean => {
      const rate = getExchangeRate(from.toLowerCase(), to.toLowerCase());

      return typeof rate === 'number';
    },
    [getExchangeRate],
  );

  const convert = useCallback(
    ({ amount, from, to }: CurrencyConversionOptions): number | null => {
      if (!Number.isFinite(amount) || !hasExchangeRate(from, to)) {
        return null;
      }

      const rate = getExchangeRate(from, to) as number;

      return rate * amount;
    },
    [hasExchangeRate, getExchangeRate],
  );

  return (
    <CurrenciesContext.Provider
      value={{
        convert,
        getExchangeRate,
        hasExchangeRate,
      }}
    >
      {children}
    </CurrenciesContext.Provider>
  );
}

export function useCurrenciesContext() {
  return useContext(CurrenciesContext);
}
