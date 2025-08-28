import { NetworkVMType, TokenType } from '@avalabs/vm-module-types';
import { useEffect, useMemo, useState } from 'react';

import type { GetTokensListHandler } from '@core/service-worker';
import {
  ExtensionRequest,
  FungibleAssetType,
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
  RequestHandlerType,
} from '@core/types';

import {
  useAccountsContext,
  useConnectionContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui/src/contexts';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { NetworkContractToken } from '@avalabs/core-chains-sdk';

// TODO: Make me prettier
// TODO2: Currently the hook is using favoriteNetwork. It should be changed to enabledNetworks once added.
export const useAllTokensFromEnabledNetworks = () => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { favoriteNetworks } = useNetworkContext();
  const { request } = useConnectionContext();

  const [placeholderTokens, setPlaceholderTokens] = useState<
    FungibleTokenBalance[]
  >([]);

  const { customTokens } = useSettingsContext();

  useEffect(() => {
    Promise.allSettled(
      Object.values(favoriteNetworks).map((network) =>
        getNetworkTokens({ request, network }),
      ),
    ).then((settledResults) => {
      const flatTokens = settledResults
        .filter((res) => res.status === 'fulfilled')
        .map((res) => res.value)
        .flat();

      setPlaceholderTokens(flatTokens);
    });
  }, [favoriteNetworks, request]);

  const tokensForAccount = useTokensForAccount(active);

  return useMemo<FungibleTokenBalance[]>(
    () => [
      ...tokensForAccount,
      ...placeholderTokens.filter(
        (token) =>
          !tokensForAccount.find(
            (balanceToken) =>
              getUniqueTokenId(balanceToken) === getUniqueTokenId(token),
          ),
      ),
      ...Object.entries(customTokens).flatMap(([chainId, tokens]) =>
        Object.values(tokens).map(mapper(Number(chainId))),
      ),
    ],
    [customTokens, placeholderTokens, tokensForAccount],
  );
};

const getNetworkTokens = async ({
  request,
  network,
}: {
  request: RequestHandlerType;
  network: NetworkWithCaipId;
}) => {
  return request<GetTokensListHandler>({
    method: ExtensionRequest.GET_NETWORK_TOKENS,
    params: [network.chainId, []],
  })
    .then((result) => {
      const nativeToken: FungibleTokenBalance = {
        type: TokenType.NATIVE,
        balance: 0n,
        balanceDisplayValue: '0',
        assetType: getNativeAssetType(network),
        coreChainId: network.chainId,
        name: network.networkToken.name,
        symbol: network.networkToken.symbol,
        decimals: network.networkToken.decimals,
        logoUri: network.networkToken.logoUri,
        coingeckoId: '',
      };

      return [
        nativeToken,
        ...Object.values(result.tokens).map<FungibleTokenBalance>(
          mapper(network.chainId),
        ),
      ];
    })
    .catch(() => []);
};

const getNativeAssetType = (network: NetworkWithCaipId): FungibleAssetType => {
  switch (network.vmName) {
    case NetworkVMType.EVM:
      return 'evm_erc20';
    case NetworkVMType.PVM:
      return 'pvm_native';
    case NetworkVMType.AVM:
      return 'avm_native';
    case NetworkVMType.SVM:
      return 'svm_spl';
    case NetworkVMType.BITCOIN:
      return 'btc_native';
    default:
      return 'unknown';
  }
};

const mapper =
  (chainId: number) =>
  (tokenData: NetworkContractToken): FungibleTokenBalance => ({
    type: tokenData.contractType === 'SPL' ? TokenType.SPL : TokenType.ERC20,
    address: tokenData.address,
    name: tokenData.name,
    symbol: tokenData.symbol,
    decimals: tokenData.decimals,
    balance: 0n,
    balanceDisplayValue: '0',
    reputation: null,
    assetType: tokenData.contractType === 'SPL' ? 'svm_spl' : 'evm_erc20',
    coreChainId: chainId,
    logoUri: tokenData.logoUri,
  });
