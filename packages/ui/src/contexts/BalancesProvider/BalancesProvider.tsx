import { Erc1155Token, Erc721Token } from '@avalabs/glacier-sdk';
import {
  GetBalancesHandler,
  RefreshNftMetadataHandler,
  StartBalancesPollingHandler,
  StopBalancesPollingHandler,
  UpdateBalancesForNetworkHandler,
} from '@core/service-worker';
import {
  AtomicBalances,
  Balances,
  ExtensionRequest,
  TotalAtomicBalanceForAccount,
  TotalPriceChange,
} from '@core/types';
import { merge } from 'lodash';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { filter, map } from 'rxjs';

import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';
import {
  calculateTotalBalance,
  getAddressForChain,
  getDefaultChainIds,
  getSmallImageForNFT,
  ipfsResolverWithFallback,
  isNotNullish,
} from '@core/common';
import { Account, NetworkWithCaipId, TokensPriceShortData } from '@core/types';
import { useAccountsContext } from '../AccountsProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { useNetworkContext } from '../NetworkProvider';
import { isBalancesUpdatedEvent } from './isBalancesUpdatedEvent';
import { GetTotalAtomicFundsForAccountHandler } from '~/services/balances/handlers/getTotalAtomicFundsForAccount';

export const IPFS_URL = 'https://ipfs.io';

export interface BalancesState {
  loading: boolean;
  nfts?: Balances<NftTokenWithBalance>;
  tokens?: Balances;
  atomic?: AtomicBalances;
  cached?: boolean;
  error?: string;
}

export interface TokensPriceData {
  currency: string;
  lastUpdatedAt: number;
  tokensData: TokensPriceShortData;
}

type BalanceSubscribers = Partial<Record<TokenType, number>>;

enum BalanceActionType {
  UPDATE_BALANCES = 'UPDATE_BALANCES',
  SET_LOADING = 'SET_LOADING',
  UPDATE_NFT_METADATA = 'UPDATE_NFT_METADATA',
}
type BalanceAction =
  | { type: BalanceActionType.SET_LOADING; payload: boolean }
  | {
      type: BalanceActionType.UPDATE_BALANCES;
      payload: {
        balances?: {
          nfts: Balances<NftTokenWithBalance>;
          tokens: Balances;
          atomic: AtomicBalances;
        };
        isBalancesCached?: boolean;
      };
    }
  | {
      type: BalanceActionType.UPDATE_NFT_METADATA;
      payload: {
        address: string;
        chainId: string;
        tokenId: string;
        updates: Erc721Token | Erc1155Token;
      };
    };

export type AccountAtomicBalanceState =
  Partial<TotalAtomicBalanceForAccount> & {
    isLoading: boolean;
    hasErrorOccurred: boolean;
  };

const BalancesContext = createContext<{
  balances: BalancesState;
  refreshNftMetadata(
    address: string,
    chainId: string,
    tokenId: string,
  ): Promise<void>;
  getTokenPrice(addressOrSymbol: string): number | undefined;
  updateBalanceOnNetworks: (
    accounts: Account[],
    chainIds?: number[],
  ) => Promise<void>;
  registerSubscriber: (tokenTypes: TokenType[]) => void;
  unregisterSubscriber: (tokenTypes: TokenType[]) => void;
  isTokensCached: boolean;
  totalBalance?: { sum: number | null; priceChange: TotalPriceChange };
  getTotalBalance: (addressC: string) =>
    | {
        sum: number | null;
        priceChange: TotalPriceChange;
      }
    | undefined;
  getAtomicBalance: (
    accountId: string | undefined,
  ) => AccountAtomicBalanceState | undefined;
}>({
  balances: { loading: true },
  getTokenPrice() {
    return undefined;
  },
  async refreshNftMetadata() {},
  async updateBalanceOnNetworks() {},
  registerSubscriber() {},
  unregisterSubscriber() {},
  isTokensCached: true,
  totalBalance: undefined,
  getTotalBalance() {
    return undefined;
  },
  getAtomicBalance() {
    return undefined;
  },
});

function balancesReducer(
  state: BalancesState,
  action: BalanceAction,
): BalancesState {
  switch (action.type) {
    case BalanceActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case BalanceActionType.UPDATE_BALANCES: {
      if (!Object.keys(action.payload).length) {
        return { ...state };
      }

      return {
        ...state,
        loading: false,
        cached: action.payload.isBalancesCached,
        // use deep merge to make sure we keep all accounts in there, even after a partial update
        tokens: merge({}, state.tokens, action.payload.balances?.tokens),
        nfts: { ...state.nfts, ...action.payload.balances?.nfts },
      };
    }
    case BalanceActionType.UPDATE_NFT_METADATA:
      return {
        ...state,
        nfts: updateMatchingNftMetadata({
          chainId: action.payload.chainId,
          address: action.payload.address,
          tokenId: action.payload.tokenId,
          newTokenData: action.payload.updates,
          nfts: state.nfts,
        }),
      };
    default:
      throw new Error();
  }
}

export function BalancesProvider({ children }: PropsWithChildren) {
  const { request, events } = useConnectionContext();
  const { network, enabledNetworkIds, getNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
    getAccount,
  } = useAccountsContext();

  const [balances, dispatch] = useReducer(balancesReducer, {
    loading: true,
    cached: true,
  });

  const [accountAtomicBalances, setAccountAtomicBalances] = useState<
    Record<string, AccountAtomicBalanceState>
  >({});

  const [subscribers, setSubscribers] = useState<BalanceSubscribers>({});

  const registerSubscriber = useCallback((tokenTypes: TokenType[]) => {
    setSubscribers((oldSubscribers) =>
      tokenTypes.reduce<BalanceSubscribers>(
        (newSubscribers, tokenType) => {
          newSubscribers[tokenType] ??= 0;
          newSubscribers[tokenType]++;
          return newSubscribers;
        },
        { ...oldSubscribers },
      ),
    );
  }, []);

  const unregisterSubscriber = useCallback((tokenTypes: TokenType[]) => {
    setSubscribers((oldSubscribers) =>
      tokenTypes.reduce(
        (newSubscribers, tokenType) => {
          newSubscribers[tokenType] ??= 0;
          newSubscribers[tokenType] = Math.max(
            newSubscribers[tokenType] - 1,
            0,
          );
          return newSubscribers;
        },
        { ...oldSubscribers },
      ),
    );
  }, []);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(isBalancesUpdatedEvent),
        map((evt) => evt.value),
      )
      .subscribe((balancesData) => {
        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: balancesData,
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
      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: balancesData,
      });
    });
  }, [request]);

  const fetchAtomicBalanceForAccount = useCallback(
    async (accountId: string) => {
      setAccountAtomicBalances((prevState) => ({
        ...prevState,
        [accountId]: {
          ...prevState[accountId],
          hasErrorOccurred: false,
          isLoading: true,
        },
      }));
      request<GetTotalAtomicFundsForAccountHandler>({
        method: ExtensionRequest.GET_ATOMIC_FUNDS_FOR_ACCOUNT,
        params: {
          accountId,
        },
      })
        .then((atomicBalance) => {
          setAccountAtomicBalances((prevState) => ({
            ...prevState,
            [accountId]: {
              balanceDisplayValue: atomicBalance.sum,
              hasErrorOccurred: false,
              isLoading: false,
            },
          }));
        })
        .catch((_err) => {
          setAccountAtomicBalances((prevState) => ({
            ...prevState,
            [accountId]: {
              ...prevState[accountId],
              hasErrorOccurred: true,
              isLoading: false,
            },
          }));
        });
    },
    [request],
  );

  useEffect(() => {
    if (!activeAccount) {
      return;
    }

    fetchAtomicBalanceForAccount(activeAccount.id);

    const tokenTypes = Object.entries(subscribers)
      .filter(([, subscriberCount]) => subscriberCount > 0)
      .map(([tokenType]) => tokenType as TokenType);

    if (tokenTypes.length > 0) {
      request<StartBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_START_POLLING,
        params: [activeAccount, enabledNetworkIds, tokenTypes],
      }).then((balancesData) => {
        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: balancesData,
        });
      });
    } else {
      request<StopBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_STOP_POLLING,
      });
    }

    return () => {
      request<StopBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_STOP_POLLING,
      });
    };
  }, [
    request,
    activeAccount,
    network?.chainId,
    enabledNetworkIds,
    subscribers,
    fetchAtomicBalanceForAccount,
  ]);

  const updateBalanceOnNetworks = useCallback(
    async (accounts: Account[], chainIds?: number[]) => {
      if (!network && !chainIds?.length) {
        return;
      }

      const updatedBalances = await request<UpdateBalancesForNetworkHandler>({
        method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
        params: [accounts, chainIds],
      });

      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: { balances: updatedBalances, isBalancesCached: false },
      });
    },
    [network, request],
  );

  const refreshNftMetadata = useCallback(
    async (address: string, chainId: string, tokenId: string) => {
      const result = await request<RefreshNftMetadataHandler>({
        method: ExtensionRequest.NFT_REFRESH_METADATA,
        params: [address, chainId, tokenId],
      });

      if (result.metadata) {
        dispatch({
          type: BalanceActionType.UPDATE_NFT_METADATA,
          payload: { address, chainId, tokenId, updates: result },
        });
      }
    },
    [request],
  );

  const getTotalBalance = useCallback(
    (addressC: string) => {
      const chainIds = [
        network?.chainId,
        ...getDefaultChainIds(!network?.isTestnet),
        ...enabledNetworkIds,
      ].filter(isNotNullish);
      const networks = chainIds.map(getNetwork).filter(isNotNullish);

      if (balances.tokens && network?.chainId) {
        return calculateTotalBalance(
          getAccount(addressC),
          networks,
          balances.tokens,
        );
      }

      return undefined;
    },
    [
      getAccount,
      enabledNetworkIds,
      getNetwork,
      network?.chainId,
      network?.isTestnet,
      balances.tokens,
    ],
  );

  const getAtomicBalance = useCallback(
    (accountId: string | undefined) => {
      if (!accountId) {
        return undefined;
      }

      return accountAtomicBalances[accountId];
    },
    [accountAtomicBalances],
  );

  const getTokenPrice = useCallback(
    (addressOrSymbol: string, lookupNetwork?: NetworkWithCaipId) => {
      if (!activeAccount) {
        return;
      }

      const tokenNetwork = lookupNetwork ?? network;

      if (!tokenNetwork) {
        return;
      }

      const addressForChain = getAddressForChain(tokenNetwork, activeAccount);

      if (!addressForChain) {
        return;
      }

      const accountBalances =
        balances.tokens?.[tokenNetwork.chainId]?.[addressForChain];

      const token =
        accountBalances?.[addressOrSymbol] ??
        // Also try lower-cased.
        // Native token symbols are not lower-cased by the balance services.
        accountBalances?.[addressOrSymbol.toLowerCase()];

      return token?.priceInCurrency;
    },
    [balances.tokens, activeAccount, network],
  );

  return (
    <BalancesContext.Provider
      value={{
        balances,
        getTokenPrice,
        refreshNftMetadata,
        updateBalanceOnNetworks,
        registerSubscriber,
        unregisterSubscriber,
        isTokensCached: balances.cached ?? true,
        totalBalance: activeAccount
          ? getTotalBalance(activeAccount.addressC)
          : undefined,
        getTotalBalance,
        getAtomicBalance,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalancesContext() {
  return useContext(BalancesContext);
}

const updateMatchingNftMetadata = ({
  address,
  chainId,
  tokenId,
  nfts,
  newTokenData,
}: {
  address: string;
  chainId: string;
  tokenId: string;
  nfts?: Balances<NftTokenWithBalance>;
  newTokenData: Erc721Token | Erc1155Token;
}): Balances<NftTokenWithBalance> | undefined => {
  const existingTokenData = nfts?.[chainId]?.[address]?.[tokenId];
  if (!existingTokenData) {
    return nfts;
  }

  const isErc721 = newTokenData.ercType === Erc721Token.ercType.ERC_721;

  const imageProps = newTokenData.metadata.imageUri
    ? {
        logoUri: ipfsResolverWithFallback(newTokenData.metadata.imageUri),
        logoSmall: getSmallImageForNFT(newTokenData.metadata.imageUri),
      }
    : {};

  return {
    ...nfts,
    [chainId]: {
      ...nfts[chainId],
      [address]: {
        ...nfts[chainId]?.[address],
        [tokenId]: {
          ...existingTokenData,
          metadata: {
            description: newTokenData.metadata.description,
            lastUpdatedTimestamp:
              newTokenData.metadata.metadataLastUpdatedTimestamp,
            properties: isErc721
              ? newTokenData.metadata.attributes
              : newTokenData.metadata.properties,
          },
          ...imageProps,
        },
      },
    },
  };
};
