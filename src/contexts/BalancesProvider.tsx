import { hexToBN } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import {
  Balances,
  SerializedBalances,
} from '@src/background/services/balances/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { createContext, useContext, useEffect, useState } from 'react';
import { concat, filter, from, map } from 'rxjs';

const BalancesContext = createContext<{ balances: Balances }>({ balances: {} });

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [balances, setBalances] = useState<Balances>({});

  useEffect(() => {
    const subscription = concat(
      from(
        request({
          method: ExtensionRequest.BALANCES_GET,
        })
      ),
      events().pipe(
        filter(balancesUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((result: SerializedBalances) => {
      setBalances(deserializeBalances(result ?? {}));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  return (
    <BalancesContext.Provider value={{ balances }}>
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalancesContext() {
  return useContext(BalancesContext);
}

function deserializeBalances(balances: SerializedBalances): Balances {
  return Object.keys(balances).reduce<Balances>((deserialized, networkId) => {
    deserialized[networkId] = Object.keys(balances[networkId]).reduce(
      (acc, account) => {
        acc[account] = balances[networkId][account].map((balance) => ({
          ...balance,
          balance: hexToBN(balance.balance),
        }));
        return acc;
      },
      {}
    );
    return deserialized;
  }, {});
}
