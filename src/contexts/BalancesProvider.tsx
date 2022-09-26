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
import { filter, map, timer } from 'rxjs';
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';
import { getNetworkIdsToUpdate } from './utils/getNetworkIdsToUpdate';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import _ from 'lodash';

interface NftState {
  loading: boolean;
  items?: NftTokenWithBalance[];
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
}>({
  tokens: { loading: true },
  nfts: { loading: true },
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
  const { network, networks } = useNetworkContext();
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

    const nonActiveChainIds = networks
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
  }, [activeAccount, network, networks, request]);

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
    if (!activeAccount || !network?.chainId) {
      setNfts({ loading: true });
      return;
    }
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
