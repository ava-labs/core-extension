import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  Balances,
  NftPageTokens,
  NftTokenWithBalance,
  TokenType,
  TotalPriceChange,
  getTokenPrice as getTokenPriceFromBalance,
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
  useMemo,
  useReducer,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { merge } from 'lodash';
import { Erc1155Token, Erc721Token } from '@avalabs/glacier-sdk';

import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';
import { balancesUpdatedEventListener } from '@src/background/services/balances/events/balancesUpdatedEventListener';
import { Account } from '@src/background/services/accounts/models';
import { StartBalancesPollingHandler } from '@src/background/services/balances/handlers/startBalancesPolling';
import { StopBalancesPollingHandler } from '@src/background/services/balances/handlers/stopBalancesPolling';
import { RefreshNftMetadataHandler } from '@src/background/services/balances/handlers/refreshNftMetadata';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import { getSmallImageForNFT } from '@src/background/services/balances/nft/utils/getSmallImageForNFT';
import { parseRawAttributesString } from '@src/utils/nfts/metadataParser';
import { TokensPriceShortData } from '@src/background/services/tokens/models';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';
import { Network } from '@src/background/services/network/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';

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
}

export interface TokensPriceData {
  currency: string;
  lastUpdatedAt: number;
  tokensData: TokensPriceShortData;
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
        isBalancesCached?: boolean;
      };
    };

const BalancesContext = createContext<{
  tokens: BalancesState;
  nfts: NftState;
  refreshNftMetadata(
    address: string,
    chainId: string,
    tokenId: string
  ): Promise<void>;
  updateNftBalances?: (
    pageToken?: NftPageTokens,
    callback?: () => void
  ) => void;
  getTokenPrice(addressOrSymbol: string): number | undefined;
  updateBalanceOnAllNetworks: (accounts: Account[]) => Promise<void>;
  registerSubscriber: () => void;
  unregisterSubscriber: () => void;
  isTokensCached: boolean;
  totalBalance?: { sum: number | null; priceChange: TotalPriceChange };
  getTotalBalance: (addressC: string) =>
    | {
        sum: number | null;
        priceChange: TotalPriceChange;
      }
    | undefined;
}>({
  tokens: { loading: true },
  nfts: { loading: false },
  getTokenPrice() {
    return undefined;
  },
  async refreshNftMetadata() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  async updateBalanceOnAllNetworks() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  registerSubscriber() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  unregisterSubscriber() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  isTokensCached: true,
  totalBalance: undefined,
  getTotalBalance() {
    return undefined;
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
      };

    default:
      throw new Error();
  }
}

export function BalancesProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { network, favoriteNetworks } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
    getAccount,
  } = useAccountsContext();
  const [tokens, dispatch] = useReducer(balancesReducer, {
    loading: true,
    cached: true,
  });

  const [nfts, setNfts] = useState<NftState>({ loading: true });
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  const polledChainIds = useMemo(
    () => favoriteNetworks.map(({ chainId }) => chainId),
    [favoriteNetworks]
  );

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
        const { balances, isBalancesCached } = balancesData;

        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: { balances, isBalancesCached },
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
      const { balances, isBalancesCached } = balancesData;

      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: { balances, isBalancesCached },
      });
    });
  }, [request]);

  useEffect(() => {
    if (!activeAccount) {
      return;
    }

    if (isPolling) {
      request<StartBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_START_POLLING,
        params: [activeAccount, polledChainIds],
      }).then((balancesData) => {
        const { balances, isBalancesCached } = balancesData;

        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: { balances, isBalancesCached },
        });
      });
    }

    return () => {
      request<StopBalancesPollingHandler>({
        method: ExtensionRequest.BALANCES_STOP_POLLING,
      });
    };
  }, [request, isPolling, activeAccount, network?.chainId, polledChainIds]);

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
    async (accounts: Account[]) => {
      if (!network) {
        return;
      }

      const balances = await request<UpdateBalancesForNetworkHandler>({
        method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
        params: [accounts],
      });

      dispatch({
        type: BalanceActionType.UPDATE_BALANCES,
        payload: { balances, isBalancesCached: false },
      });
    },
    [network, request]
  );

  const refreshNftMetadata = useCallback(
    async (address: string, chainId: string, tokenId: string) => {
      const result = await request<RefreshNftMetadataHandler>({
        method: ExtensionRequest.NFT_REFRESH_METADATA,
        params: [address, chainId, tokenId],
      });

      if (result.metadata) {
        setNfts((_nfts) => ({
          ...nfts,
          items: (_nfts.items ?? []).map(
            updateMatchingNftMetadata(address, tokenId, result)
          ),
        }));
      }
    },
    [request, nfts]
  );

  const getTotalBalance = useCallback(
    (addressC: string) => {
      if (tokens.balances) {
        return calculateTotalBalance(
          network,
          getAccount(addressC),
          favoriteNetworks.map(({ chainId }) => chainId),
          tokens.balances
        );
      }

      return undefined;
    },
    [getAccount, favoriteNetworks, network, tokens.balances]
  );

  const getTokenPrice = useCallback(
    (addressOrSymbol: string, lookupNetwork?: Network) => {
      if (!activeAccount) {
        return;
      }

      const chainId = (lookupNetwork ?? network)?.chainId;

      if (!chainId) {
        return;
      }

      const addressForChain = getAddressForChain(chainId, activeAccount);

      if (!addressForChain) {
        return;
      }

      const token =
        tokens.balances?.[chainId]?.[addressForChain]?.[addressOrSymbol];

      return getTokenPriceFromBalance(token);
    },
    [tokens.balances, activeAccount, network]
  );

  return (
    <BalancesContext.Provider
      value={{
        tokens,
        nfts,
        getTokenPrice,
        refreshNftMetadata,
        updateNftBalances,
        updateBalanceOnAllNetworks,
        registerSubscriber,
        unregisterSubscriber,
        isTokensCached: tokens.cached ?? true,
        totalBalance: activeAccount
          ? getTotalBalance(activeAccount.addressC)
          : undefined,
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

const updateMatchingNftMetadata =
  (
    address: string,
    tokenId: string,
    newTokenData: Erc721Token | Erc1155Token
  ) =>
  (item: NftTokenWithBalance) => {
    if (item.address !== address || item.tokenId !== tokenId) {
      return item;
    }

    const isErc721 = newTokenData.ercType === Erc721Token.ercType.ERC_721;

    const imageProps = newTokenData.metadata.imageUri
      ? {
          logoUri: ipfsResolverWithFallback(newTokenData.metadata.imageUri),
          logoSmall: getSmallImageForNFT(newTokenData.metadata.imageUri),
        }
      : {};

    return {
      ...item,
      updatedAt: newTokenData.metadata.metadataLastUpdatedTimestamp,
      attributes: isErc721
        ? parseRawAttributesString(newTokenData.metadata.attributes)
        : parseRawAttributesString(newTokenData.metadata.properties),
      ...imageProps,
    };
  };
