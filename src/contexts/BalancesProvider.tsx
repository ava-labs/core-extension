import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  Balances,
  NftPageTokens,
  NftTokenWithBalance,
  TokenType,
  TotalBalance,
} from '@src/background/services/balances/models';
import { GetBalancesHandler } from '@src/background/services/balances/handlers/getBalances';
import { GetNftBalancesHandler } from '@src/background/services/balances/handlers/getNftBalances';
import { UpdateBalancesForNetworkHandler } from '@src/background/services/balances/handlers/updateBalancesForNetwork';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { merge } from 'lodash';
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import { Account } from '@src/background/services/accounts/models';
import { StartBalancesPollingHandler } from '@src/background/services/balances/handlers/startBalancesPolling';
import { StopBalancesPollingHandler } from '@src/background/services/balances/handlers/stopBalancesPolling';
import { getAccountKey } from '@src/utils/getAccountKey';

interface NftState {
  loading: boolean;
  items?: NftTokenWithBalance[];
  pageTokens?: NftPageTokens;
  error?: string;
}
export interface BalancesState {
  loading: boolean;
  balances?: Balances;
  cached?: boolean;
  totalBalance?: TotalBalance | null;
  lastUpdated?: number;
}

enum BalanceActionType {
  UPDATE_BALANCES = 'UPDATE_BALANCES',
  SET_LOADING = 'SET_LOADING',
}
type BalanceAction =
  | { type: BalanceActionType.SET_LOADING; payload: boolean }
  | {
      type: BalanceActionType.UPDATE_BALANCES;
      payload: {
        balances?: Balances;
        totalBalance?: TotalBalance | null;
        lastUpdated?: number;
        isBalancesCached?: boolean;
      };
    };

const BalancesContext = createContext<{
  tokens: BalancesState;
  nfts: NftState;
  updateNftBalances?: (pageToken: NftPageTokens, callback?: () => void) => void;
  updateBalanceOnAllNetworks?: (account: Account) => Promise<void>;
  registerSubscriber: () => void;
  unregisterSubscriber: () => void;
  isTokensCached: boolean;
  totalBalance: number | null;
  getTotalBalance: (addressC?: string) => number | null;
}>({
  tokens: { loading: true },
  nfts: { loading: false },
  registerSubscriber() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  unregisterSubscriber() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  isTokensCached: true,
  totalBalance: null,
  getTotalBalance() {
    return null;
  },
});

function balancesReducer(
  state: BalancesState,
  action: BalanceAction
): BalancesState {
  switch (action.type) {
    case BalanceActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case BalanceActionType.UPDATE_BALANCES:
      if (!Object.keys(action.payload).length) {
        return { ...state };
      }
      return {
        ...state,
        loading: false,
        cached: action.payload.isBalancesCached,
        // use deep merge to make sure we keep all accounts in there, even after a partial update
        balances: merge({}, state.balances, action.payload.balances),
        totalBalance: merge(
          {},
          state.totalBalance,
          action.payload.totalBalance
        ),
      };

    default:
      throw new Error();
  }
}

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { network, networks } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const [tokens, dispatch] = useReducer(balancesReducer, {
    loading: true,
    cached: true,
  });

  const [nfts, setNfts] = useState<NftState>({ loading: true });
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  const registerSubscriber = useCallback(() => {
    setSubscriberCount((count) => count + 1);
  }, []);

  const unregisterSubscriber = useCallback(() => {
    setSubscriberCount((count) => count - 1);
  }, []);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(balancesUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((balancesData) => {
        const { balances, isBalancesCached, totalBalance } = balancesData;
        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: { balances, isBalancesCached, totalBalance },
        });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [events]);

  useEffect(() => {
    dispatch({
      type: BalanceActionType.SET_LOADING,
      payload: true,
    });
    request<GetBalancesHandler>({
      method: ExtensionRequest.BALANCES_GET,
    }).then((balancesData) => {
      const { balances, isBalancesCached, totalBalance } = balancesData;
      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: { balances, isBalancesCached, totalBalance },
      });
    });
  }, [request]);

  useEffect(() => {
    if (isPolling) {
      request<StartBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_START_POLLING,
      }).then((balancesData) => {
        const { balances, isBalancesCached, totalBalance } = balancesData;
        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: { balances, isBalancesCached, totalBalance },
        });
      });
    }

    return () => {
      request<StopBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_STOP_POLLING,
      });
    };
  }, [request, isPolling]);

  useEffect(() => {
    // Toggle balance polling based on the amount of dependent components.
    setIsPolling(subscriberCount > 0);
  }, [subscriberCount]);

  const updateNftBalances = useCallback(
    async (pageTokens?: NftPageTokens, callback?: () => void) => {
      if (
        !pageTokens ||
        (!pageTokens[TokenType.ERC1155] && !pageTokens[TokenType.ERC721])
      ) {
        setNfts({ loading: true });
      }

      request<GetNftBalancesHandler>({
        method: ExtensionRequest.NFT_BALANCES_GET,
        params: [pageTokens],
      })
        .then((result) => {
          setNfts((prevState) => {
            return {
              items: pageTokens
                ? [...(prevState.items ?? []), ...result.list]
                : result.list,
              pageTokens: result.pageTokens,
              loading: false,
            };
          });
        })
        .catch((e) => {
          setNfts((prevState) => {
            return { ...prevState, ...{ loading: false, error: e } };
          });
        })
        .finally(() => {
          if (callback) {
            callback();
          }
        });
    },
    [request]
  );

  useEffect(() => {
    if (!activeAccount?.addressC || !network?.chainId) {
      return;
    }
    updateNftBalances();

    // trigger nft updates whenever the network has changed
    // trigger nft updates whenever the account changes
  }, [network?.chainId, activeAccount?.addressC, updateNftBalances]);

  const updateBalanceOnAllNetworks = useCallback(
    async (account: Account) => {
      const networkIds = networks.map(({ chainId }) => chainId);

      const balances = await request<UpdateBalancesForNetworkHandler>({
        method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
        params: [[account], networkIds],
      });

      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: { balances, isBalancesCached: false },
      });
    },
    [request, networks]
  );

  const getTotalBalance = useCallback(
    (addressC?: string) => {
      if (
        tokens.totalBalance !== undefined &&
        tokens.totalBalance !== null &&
        activeAccount?.addressC
      ) {
        const accountKey = getAccountKey({
          address: addressC || activeAccount?.addressC,
          isTestnet: network?.isTestnet,
        });
        return tokens.totalBalance[accountKey] ?? null;
      }
      return null;
    },
    [activeAccount?.addressC, network?.isTestnet, tokens]
  );

  return (
    <BalancesContext.Provider
      value={{
        tokens,
        nfts,
        updateNftBalances,
        updateBalanceOnAllNetworks,
        registerSubscriber,
        unregisterSubscriber,
        isTokensCached: tokens.cached ?? true,
        totalBalance: getTotalBalance(),
        getTotalBalance,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalancesContext() {
  return useContext(BalancesContext);
}
