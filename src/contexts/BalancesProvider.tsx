import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import { GetBalancesHandler } from '@src/background/services/balances/handlers/getBalances';
import { GetNftBalancesHandler } from '@src/background/services/balances/handlers/getNftBalances';
import { UpdateBalancesForNetworkHandler } from '@src/background/services/balances/handlers/updateBalancesForNetwork';
import { Balances } from '@src/background/services/balances/models';
import { NFT } from '@src/background/services/balances/nft/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter, interval, map, timer } from 'rxjs';
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';

interface NftState {
  loading: boolean;
  items?: NFT[];
  error?: string;
}
interface BalancesState {
  loading: boolean;
  balances?: Balances;
}

const BalancesContext = createContext<{
  tokens: BalancesState;
  nfts: NftState;
}>({
  tokens: { loading: true },
  nfts: { loading: true },
});

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { network } = useNetworkContext();
  const { activeAccount } = useAccountsContext();
  const [tokens, setTokens] = useState<BalancesState>({ loading: true });
  const [nfts, setNfts] = useState<NftState>({ loading: true });

  useEffect(() => {
    setTokens({
      loading: true,
    });

    request<GetBalancesHandler>({
      method: ExtensionRequest.BALANCES_GET,
    }).then((balances) => {
      setTokens({ balances, loading: false });
    });
  }, [request]);

  useEffect(() => {
    // update balances every 2 seconds for the active network when the UI is open
    // update balances for all networks and accounts every 30 seconds
    const subscription = interval(2000).subscribe((intervalCount) => {
      if (!activeAccount || !network) return;

      if (intervalCount % 15 === 0) {
        request<UpdateBalancesForNetworkHandler>({
          method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
        });
      } else {
        request<UpdateBalancesForNetworkHandler>({
          method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
          params: [[activeAccount], [network]],
        });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [activeAccount, network, request]);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(balancesUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((result) => {
        setTokens({
          balances: {
            ...tokens.balances,
            ...result,
          },
          loading: false,
        });
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [events, tokens.balances]);

  const updateNftBalances = useCallback(
    (resetPreviousState = true) => {
      if (resetPreviousState) {
        setNfts({ loading: true });
      }
      request<GetNftBalancesHandler>({
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
    // trigger nft updates whenever the account changes
  }, [request, network?.chainId, updateNftBalances, activeAccount]);

  return (
    <BalancesContext.Provider value={{ tokens, nfts }}>
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalancesContext() {
  return useContext(BalancesContext);
}
