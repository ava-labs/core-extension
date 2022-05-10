import { hexToBN } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { createContext, useContext, useEffect, useState } from 'react';
import { concat, filter, from, map } from 'rxjs';

type BalancesByAccount = { [account: string]: TokenWithBalance[] };
type SerializedBalance = Omit<TokenWithBalance, 'balance'> & {
  balance: string;
};
type SerializedBalancesByAccount = { [account: string]: SerializedBalance[] };
const BalancesContext = createContext<BalancesByAccount>({});

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [balances, setBalances] = useState<BalancesByAccount>({});

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
    ).subscribe((result: SerializedBalancesByAccount) => {
      setBalances(deserializeBalances(result ?? {}));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalancesContext() {
  return useContext(BalancesContext);
}

function deserializeBalances(
  balances: SerializedBalancesByAccount
): BalancesByAccount {
  return Object.keys(balances).reduce<BalancesByAccount>(
    (deserialized, account) => {
      deserialized[account] = balances[account].map((balance) => ({
        ...balance,
        balance: hexToBN(balance.balance),
      }));
      return deserialized;
    },
    {}
  );
}
