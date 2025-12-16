import { Erc1155Token, Erc721Token } from '@avalabs/glacier-sdk';
import {
  GetBalancesHandler,
  GetTokenPriceByAddressHandler,
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
  IMPORTED_ACCOUNTS_WALLET_ID,
} from '@core/types';
import { merge, isString } from 'lodash';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
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
import { useWalletContext } from '../WalletProvider';
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

export type WalletTotalBalanceState = {
  totalBalanceInCurrency?: number;
  balanceChange?: number;
  percentageChange?: number;
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
  getTokenPrice(
    addressOrSymbol: string,
    lookupNetwork?: NetworkWithCaipId,
  ): Promise<number | undefined>;
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
  // Wallet total balance functions
  walletBalances: Record<string, WalletTotalBalanceState>;
  fetchBalanceForWallet: (walletId: string) => Promise<void>;
  fetchWalletBalancesSequentially: () => Promise<void>;
  getWalletTotalBalance: (walletId?: string) => WalletTotalBalanceState;
}>({
  balances: { loading: true },
  async getTokenPrice() {
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
  // Wallet total balance defaults
  walletBalances: {},
  async fetchBalanceForWallet() {},
  async fetchWalletBalancesSequentially() {},
  getWalletTotalBalance() {
    return { isLoading: false, hasErrorOccurred: false };
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

      // Only set loading to false when we actually have token data because the cached data might be empty for a new user
      const hasTokenData =
        action.payload.balances?.tokens &&
        Object.keys(action.payload.balances.tokens).length > 0;

      return {
        ...state,
        loading: hasTokenData ? false : state.loading,
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
    accounts: { active: activeAccount, imported: importedAccounts },
    getAccount,
    getAccountsByWalletId,
  } = useAccountsContext();
  const { wallets } = useWalletContext();

  const [balances, dispatch] = useReducer(balancesReducer, {
    loading: true,
    cached: true,
  });

  const [accountAtomicBalances, setAccountAtomicBalances] = useState<
    Record<string, AccountAtomicBalanceState>
  >({});

  const [subscribers, setSubscribers] = useState<BalanceSubscribers>({});

  // Wallet total balance state
  const [walletBalances, setWalletBalances] = useState<
    Record<string, WalletTotalBalanceState>
  >({});
  const isMounted = useRef<boolean>(false);
  const isSyncingBalances = useRef<boolean>(false);

  const hasImportedAccounts = useMemo(
    () => Object.keys(importedAccounts).length > 0,
    [importedAccounts],
  );

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
          if (!atomicBalance) {
            setAccountAtomicBalances((prevState) => ({
              ...prevState,
              [accountId]: {
                ...prevState[accountId],
                hasErrorOccurred: false,
                isLoading: false,
              },
            }));
            return;
          }

          setAccountAtomicBalances((prevState) => ({
            ...prevState,
            [accountId]: {
              balanceDisplayValue: atomicBalance.sum,
              balanceInCurrency: atomicBalance.sumInCurrency,
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
        const cChainAccount = getAccount(addressC);
        const atomicBalanceInCurrency =
          accountAtomicBalances[cChainAccount?.id ?? '']?.balanceInCurrency ??
          0;

        const totalBalance = calculateTotalBalance(
          cChainAccount,
          networks,
          balances.tokens,
        );
        return {
          ...totalBalance,
          sum: (totalBalance.sum ?? 0) + atomicBalanceInCurrency,
        };
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
      accountAtomicBalances,
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

  // Calculate wallet total balance from account balances
  const calculateWalletTotalBalance = useCallback(
    (
      walletId: string,
    ): Omit<WalletTotalBalanceState, 'isLoading' | 'hasErrorOccurred'> => {
      const accounts = getAccountsByWalletId(walletId);

      if (!accounts.length || !balances.tokens) {
        return {
          totalBalanceInCurrency: undefined,
          balanceChange: undefined,
          percentageChange: undefined,
        };
      }

      const chainIds = [
        network?.chainId,
        ...getDefaultChainIds(!network?.isTestnet),
        ...enabledNetworkIds,
      ].filter(isNotNullish);
      const networks = chainIds.map(getNetwork).filter(isNotNullish);

      let totalBalanceInCurrency = 0;
      let totalPriceChangeValue = 0;

      for (const account of accounts) {
        const accountBalance = calculateTotalBalance(
          account,
          networks,
          balances.tokens,
        );
        if (accountBalance.sum !== null) {
          totalBalanceInCurrency += accountBalance.sum;
        }
        totalPriceChangeValue += accountBalance.priceChange?.value ?? 0;

        // Add atomic balance for this account
        const atomicBalance =
          accountAtomicBalances[account.id]?.balanceInCurrency ?? 0;
        totalBalanceInCurrency += atomicBalance;
      }

      const balanceChange =
        totalPriceChangeValue !== 0 ? totalPriceChangeValue : undefined;
      let percentageChange: number | undefined = undefined;

      if (
        totalBalanceInCurrency > 0 &&
        balanceChange !== undefined &&
        balanceChange !== 0
      ) {
        const previousBalance = totalBalanceInCurrency - balanceChange;
        if (previousBalance > 0) {
          percentageChange = (balanceChange / previousBalance) * 100;
        }
      }

      return {
        totalBalanceInCurrency,
        balanceChange,
        percentageChange,
      };
    },
    [
      getAccountsByWalletId,
      balances.tokens,
      network?.chainId,
      network?.isTestnet,
      enabledNetworkIds,
      getNetwork,
      accountAtomicBalances,
    ],
  );

  // Fetch balances for all accounts in a wallet and update wallet total
  const fetchBalanceForWallet = useCallback(
    async (walletId: string) => {
      const accounts = getAccountsByWalletId(walletId);

      if (!accounts.length) {
        setWalletBalances((prevState) => ({
          ...prevState,
          [walletId]: {
            totalBalanceInCurrency: 0,
            balanceChange: undefined,
            percentageChange: undefined,
            isLoading: false,
            hasErrorOccurred: false,
          },
        }));
        return;
      }

      // Set loading state
      setWalletBalances((prevState) => ({
        ...prevState,
        [walletId]: {
          ...prevState[walletId],
          hasErrorOccurred: false,
          isLoading: true,
        },
      }));

      try {
        // Fetch balances for all accounts in the wallet in a single request
        const chainIds = [
          network?.chainId,
          ...getDefaultChainIds(!network?.isTestnet),
          ...enabledNetworkIds,
        ].filter(isNotNullish);

        const updatedBalances = await request<UpdateBalancesForNetworkHandler>({
          method: ExtensionRequest.NETWORK_BALANCES_UPDATE,
          params: [accounts, chainIds],
        });

        // Update balances state
        dispatch({
          type: BalanceActionType.UPDATE_BALANCES,
          payload: { balances: updatedBalances, isBalancesCached: false },
        });

        // Calculate wallet total from the updated balances
        const walletTotal = calculateWalletTotalBalance(walletId);

        setWalletBalances((prevState) => ({
          ...prevState,
          [walletId]: {
            ...walletTotal,
            hasErrorOccurred: false,
            isLoading: false,
          },
        }));
      } catch (err) {
        console.log('Error while fetching balances for wallet', err);
        setWalletBalances((prevState) => ({
          ...prevState,
          [walletId]: {
            ...prevState[walletId],
            hasErrorOccurred: true,
            isLoading: false,
          },
        }));
      }
    },
    [
      getAccountsByWalletId,
      network?.chainId,
      network?.isTestnet,
      enabledNetworkIds,
      request,
      calculateWalletTotalBalance,
    ],
  );

  // Fetch wallet balances sequentially for all wallets
  const fetchWalletBalancesSequentially = useCallback(async () => {
    if (isSyncingBalances.current) {
      return;
    }

    isSyncingBalances.current = true;

    const walletIds = [
      ...wallets.map(({ id }) => id),
      hasImportedAccounts ? IMPORTED_ACCOUNTS_WALLET_ID : undefined,
    ].filter(isString);

    for (const walletId of walletIds) {
      await fetchBalanceForWallet(walletId);
      if (!isMounted.current) {
        return;
      }
    }

    isSyncingBalances.current = false;
  }, [wallets, hasImportedAccounts, fetchBalanceForWallet]);

  // Get wallet total balance
  const getWalletTotalBalance = useCallback(
    (walletId?: string): WalletTotalBalanceState => {
      if (!walletId || !walletBalances[walletId]) {
        return { isLoading: false, hasErrorOccurred: false };
      }
      return walletBalances[walletId];
    },
    [walletBalances],
  );

  // Update wallet balances when account balances change
  useEffect(() => {
    isMounted.current = true;

    // Recalculate wallet balances when account balances are updated
    if (!balances.loading && balances.tokens) {
      const walletIds = [
        ...wallets.map(({ id }) => id),
        hasImportedAccounts ? IMPORTED_ACCOUNTS_WALLET_ID : undefined,
      ].filter(isString);

      setWalletBalances((prevState) => {
        const newState = { ...prevState };
        for (const walletId of walletIds) {
          const walletTotal = calculateWalletTotalBalance(walletId);
          newState[walletId] = {
            ...walletTotal,
            isLoading: prevState[walletId]?.isLoading ?? false,
            hasErrorOccurred: prevState[walletId]?.hasErrorOccurred ?? false,
          };
        }
        return newState;
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [
    balances.loading,
    balances.tokens,
    wallets,
    hasImportedAccounts,
    calculateWalletTotalBalance,
  ]);

  const getTokenPrice = useCallback(
    async (addressOrSymbol: string, lookupNetwork?: NetworkWithCaipId) => {
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

      if (token?.priceInCurrency !== undefined) {
        return token.priceInCurrency;
      }

      // Fallback: fetch price by address if we have the required coingecko info
      const coingeckoInfo = tokenNetwork.pricingProviders?.coingecko;
      if (coingeckoInfo?.assetPlatformId && coingeckoInfo?.nativeTokenId) {
        try {
          const prices = await request<GetTokenPriceByAddressHandler>({
            method: ExtensionRequest.TOKEN_PRICE_GET_BY_ADDRESS,
            params: [
              addressOrSymbol,
              coingeckoInfo.assetPlatformId,
              coingeckoInfo.nativeTokenId,
            ],
          });
          return prices[addressOrSymbol.toLowerCase()];
        } catch {
          return undefined;
        }
      }

      return undefined;
    },
    [balances.tokens, activeAccount, network, request],
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
        // Wallet total balance
        walletBalances,
        fetchBalanceForWallet,
        fetchWalletBalancesSequentially,
        getWalletTotalBalance,
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
