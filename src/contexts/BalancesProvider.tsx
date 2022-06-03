import { hexToBN } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import {
  Balances,
  SerializedBalances,
} from '@src/background/services/balances/models';
import { NFT } from '@src/background/services/balances/nftBalanceAggregators/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { concat, filter, from, interval, map, timer } from 'rxjs';
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';

interface NftState {
  loading: boolean;
  items?: NFT[];
  error?: string;
}

const BalancesContext = createContext<{
  balances: Balances;
  nfts: NftState;
}>({
  balances: {},
  nfts: { loading: true },
});

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { network } = useNetworkContext();
  const { activeAccount } = useAccountsContext();
  const [balances, setBalances] = useState<Balances>({});
  const [nfts, setNfts] = useState<NftState>({ loading: true });

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

    // update balances every 2 seconds for the active network when the UI is open
    // update balances for all networks and accounts every 30 seconds
    subscription.add(
      interval(2000).subscribe((intervalCount) => {
        if (intervalCount % 15 === 0) {
          request({
            method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
          });
        } else {
          request({
            method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
            params: [[activeAccount], [network]],
          });
        }
      })
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [activeAccount, events, network, request]);

  const updateNftBalances = useCallback(
    (resetPreviousState = true) => {
      if (resetPreviousState) {
        setNfts({ loading: true });
      }
      request({
        method: ExtensionRequest.NFT_BALANCES_GET,
      })
        .then((result) => {
          setNfts({ items: result, loading: false });
        })
        .catch((e) => {
          if (resetPreviousState) {
            setNfts({ loading: false, error: e });
          }
        });
    },
    [request]
  );

  useEffect(() => {
    updateNftBalances();
    // update nfts every 10 seconds, revisit this later
    const subscription = timer(10000).subscribe(() => {
      updateNftBalances(false);
    });

    return () => {
      subscription.unsubscribe();
    };
    // trigger nft updates whenever the network has changed
  }, [request, network?.chainId, updateNftBalances]);

  return (
    <BalancesContext.Provider value={{ balances, nfts }}>
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
