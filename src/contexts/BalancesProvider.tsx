import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  Balances,
  NftTokenWithBalance,
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
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';
import { getNetworkIdsToUpdate } from './utils/getNetworkIdsToUpdate';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import _ from 'lodash';
import { Account } from '@src/background/services/accounts/models';

interface NftState {
  loading: boolean;
  items?: NftTokenWithBalance[];
  pageToken?: string;
  error?: string;
}
interface BalancesState {
  loading: boolean;
  balances?: Balances;
}

enum BalanceActionType {
  UPDATE_BALANCES = 'UPDATE_BALANCES',
  SET_LOADING = 'SET_LOADING',
}
type BalanceAction =
  | { type: BalanceActionType.SET_LOADING; payload: boolean }
  | { type: BalanceActionType.UPDATE_BALANCES; payload: Balances };

const BalancesContext = createContext<{
  tokens: BalancesState;
  nfts: NftState;
  updateNftBalances?: (pageToken?: string, callback?: () => void) => void;
  updateBalanceOnAllNetworks?: (account: Account) => Promise<void>;
}>({
  tokens: { loading: true },
  nfts: { loading: false },
});

function balancesReducer(
  state: BalancesState,
  action: BalanceAction
): BalancesState {
  switch (action.type) {
    case BalanceActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case BalanceActionType.UPDATE_BALANCES:
      return {
        ...state,
        loading: false,
        // use deep merge to make sure we keep all accounts in there, even after a partial update
        balances: _.merge(state.balances, action.payload),
      };
    default:
      throw new Error();
  }
}

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { network, favoriteNetworks, networks } = useNetworkContext();
  const { activeAccount } = useAccountsContext();
  const [tokens, dispatch] = useReducer(balancesReducer, {
    loading: true,
  });
  const [nfts, setNfts] = useState<NftState>({ loading: true });

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(balancesUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((balances) => {
        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: balances,
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
    }).then((balances) => {
      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: balances,
      });
    });
  }, [request]);

  useEffect(() => {
    // update balances every 2 seconds for the active network when the UI is open
    // update balances for all networks and accounts every 30 seconds
    if (!activeAccount || !network) return;

    const nonActiveChainIds = favoriteNetworks
      .map((n) => n.chainId)
      .filter((id) => id !== network?.chainId);

    const updateNextBalances = async (iteration = 0) => {
      if (!activeAccount || !network) return;

      const networksToFetch = getNetworkIdsToUpdate(
        nonActiveChainIds,
        iteration,
        15 // make sure we get back to update every network after 15 iterations
      );

      const balances = await request<UpdateBalancesForNetworkHandler>({
        method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
        params: [[activeAccount], [network.chainId, ...networksToFetch]],
      });

      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: balances,
      });
    };

    let intervalId: number;
    const startTimeout = (iteration = 0) => {
      return window.setTimeout(async () => {
        await updateNextBalances(iteration);
        intervalId = startTimeout(iteration + 1);
      }, 2000);
    };

    intervalId = startTimeout();
    return () => {
      clearInterval(intervalId);
    };
  }, [activeAccount, network, favoriteNetworks, request]);

  const updateNftBalances = useCallback(
    async (pageToken?: string, callback?: () => void) => {
      if (!pageToken) {
        setNfts({ loading: true });
      }

      request<GetNftBalancesHandler>({
        method: ExtensionRequest.NFT_BALANCES_GET,
        params: [pageToken],
      })
        .then((result) => {
          setNfts((prevState) => {
            return {
              items: pageToken
                ? [...(prevState.items ?? []), ...result.list]
                : result.list,
              pageToken: result.pageToken,
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

  const updateBalanceOnAllNetworks = async (account: Account) => {
    const networkIds = networks.map((network) => network.chainId);

    const balances = await request<UpdateBalancesForNetworkHandler>({
      method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
      params: [[account], networkIds],
    });

    dispatch({
      type: BalanceActionType.UPDATE_BALANCES,
      payload: balances,
    });
  };

  return (
    <BalancesContext.Provider
      value={{ tokens, nfts, updateNftBalances, updateBalanceOnAllNetworks }}
    >
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalancesContext() {
  return useContext(BalancesContext);
}
