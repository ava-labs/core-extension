import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { filter, map } from 'rxjs';

import { DefiPortfolio, ExtensionRequest } from '@core/types';
import { GetDefiPortfolioHandler } from '@core/service-worker';

import { useAccountsContext } from '../AccountsProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { defiPortfolioUpdatedEventListener } from './defiEventFilters';

type PortfolioState = {
  hasError: boolean;
  isLoading: boolean;
  portfolio: DefiPortfolio;
};

type DefiProviderState = Record<string, PortfolioState>;
enum DefiProviderActionType {
  SetLoadingState = 'SetLoadingState',
  UpdatePortfolio = 'UpdatePortfolio',
}
interface BaseAction {
  address: string;
  type: DefiProviderActionType;
  payload: unknown;
}

interface UpdatePortfolioAction extends BaseAction {
  type: DefiProviderActionType.UpdatePortfolio;
  payload: PortfolioState;
}

interface SetLoadingStateAction extends BaseAction {
  type: DefiProviderActionType.SetLoadingState;
  payload: boolean;
}

type DefiProviderAction = UpdatePortfolioAction | SetLoadingStateAction;

const EMPTY_PORTFOLIO = {
  protocols: [],
  totalUsdValue: 0,
};

const INITIAL_PORTFOLIO_STATE = {
  hasError: false,
  isLoading: true,
  portfolio: EMPTY_PORTFOLIO,
};

const reducer = (
  state: DefiProviderState,
  { type, address, payload }: DefiProviderAction,
): DefiProviderState => {
  switch (type) {
    case DefiProviderActionType.SetLoadingState:
      return {
        ...state,
        [address]: {
          ...(state[address] ?? INITIAL_PORTFOLIO_STATE),
          isLoading: payload,
        },
      };
    case DefiProviderActionType.UpdatePortfolio:
      return {
        ...state,
        [address]: payload,
      };
    default:
      throw new Error(`DefiProvider: Unknown action type: "${type}"`);
  }
};

const DefiContext = createContext<
  PortfolioState & {
    refresh(): void;
  }
>({
  ...INITIAL_PORTFOLIO_STATE,
  refresh() {
    // no-op
  },
});

export function DefiContextProvider({ children }: PropsWithChildren<object>) {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { events, request } = useConnectionContext();

  const [state, dispatch] = useReducer(reducer, {});
  const address = active?.addressC;
  const portfolio = address
    ? (state[address] ?? INITIAL_PORTFOLIO_STATE)
    : INITIAL_PORTFOLIO_STATE;

  const refresh = useCallback(async () => {
    if (!address) {
      return;
    }

    dispatch({
      type: DefiProviderActionType.SetLoadingState,
      address,
      payload: true,
    });

    try {
      const newPortfolioState = await request<GetDefiPortfolioHandler>({
        method: ExtensionRequest.DEFI_GET_PORTFOLIO,
        params: [address],
      });

      dispatch({
        type: DefiProviderActionType.UpdatePortfolio,
        address,
        payload: {
          isLoading: false,
          hasError: false,
          portfolio: newPortfolioState,
        },
      });
    } catch {
      dispatch({
        type: DefiProviderActionType.UpdatePortfolio,
        address,
        payload: {
          isLoading: false,
          hasError: true,
          portfolio: EMPTY_PORTFOLIO,
        },
      });
    }
  }, [request, address]);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(defiPortfolioUpdatedEventListener),
        map((evt) => evt.value),
      )
      .subscribe(({ address: accountAddress, portfolio: updatedPortfolio }) => {
        dispatch({
          type: DefiProviderActionType.UpdatePortfolio,
          address: accountAddress,
          payload: {
            isLoading: false,
            hasError: false,
            portfolio: updatedPortfolio,
          },
        });
      });

    return () => subscription.unsubscribe();
  }, [events, request]);

  useEffect(() => {
    refresh();
  }, [request, refresh]);

  return (
    <DefiContext.Provider
      value={{
        ...portfolio,
        refresh,
      }}
    >
      {children}
    </DefiContext.Provider>
  );
}

export function useDefiContext() {
  return useContext(DefiContext);
}
