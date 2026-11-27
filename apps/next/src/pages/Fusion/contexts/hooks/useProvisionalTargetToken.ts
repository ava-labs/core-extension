import { useMemo } from 'react';
import { NetworkVMType, TokenType } from '@avalabs/vm-module-types';
import { ERC_ZERO_ADDRESS } from '@avalabs/fusion-sdk';

import { isAvalancheChainId, isHypercoreNetwork } from '@core/common';
import {
  type FungibleTokenBalance,
  getUniqueTokenId,
  isNativeToken,
} from '@core/types';
import { useNetworkContext } from '@core/ui';

import { type ChainOption } from '@/components/TokenSelect/components/ChainFilterChips';

import { useTokensLookup } from '../../hooks/useTokensLookup';
import { DEFAULT_TARGET_TOKENS } from '../../fusion-config';
import { parseUniqueTokenId } from '../../lib/parseUniqueTokenId';

type UseProvisionalTargetTokenParams = {
  sourceToken: FungibleTokenBalance | undefined;
  toId: string | undefined;
  isTargetTokenListLoading: boolean;
  committedTargetChainId: number | 'avalanche' | null;
  targetChainOptions: ChainOption[];
};

const SUPPORTED_VM_TYPES = [NetworkVMType.EVM, NetworkVMType.SVM];

export const useProvisionalTargetToken = ({
  sourceToken,
  toId,
  isTargetTokenListLoading,
  committedTargetChainId,
  targetChainOptions,
}: UseProvisionalTargetTokenParams): FungibleTokenBalance | undefined => {
  const { getNetwork } = useNetworkContext();

  const isListChainCommitted = (chainId: number) =>
    committedTargetChainId === 'avalanche'
      ? isAvalancheChainId(chainId)
      : committedTargetChainId === chainId;
  const isChainReachable = (chainId: number) =>
    targetChainOptions.some((option) => option.chainId === chainId);

  const explicitTarget = toId ? parseUniqueTokenId(toId) : undefined;
  const explicitChainId =
    toId &&
    explicitTarget &&
    explicitTarget.type !== TokenType.HYPERCORE_SPOT &&
    toId !== (sourceToken ? getUniqueTokenId(sourceToken) : undefined)
      ? explicitTarget.coreChainId
      : undefined;
  const defaultChainId =
    !toId && sourceToken ? sourceToken.coreChainId : undefined;
  const targetChainId = explicitChainId ?? defaultChainId;

  const isEligible =
    !!sourceToken &&
    isTargetTokenListLoading &&
    targetChainId !== undefined &&
    isListChainCommitted(targetChainId) &&
    isChainReachable(targetChainId);

  const network = isEligible ? getNetwork(targetChainId) : undefined;

  const targetAddress = useMemo(() => {
    if (
      !isEligible ||
      !sourceToken ||
      !network ||
      isHypercoreNetwork(network) ||
      !SUPPORTED_VM_TYPES.includes(network.vmName)
    ) {
      return undefined;
    }

    if (explicitTarget) {
      if (explicitTarget.type === TokenType.NATIVE) {
        return ERC_ZERO_ADDRESS;
      }

      return explicitTarget.type === TokenType.ERC20 ||
        explicitTarget.type === TokenType.SPL
        ? explicitTarget.identifier
        : undefined;
    }

    // The configured defaults are mainnet addresses and only exist on EVM / Solana.
    if (network.isTestnet) {
      return undefined;
    }

    const defaultAddress = DEFAULT_TARGET_TOKENS[sourceToken.symbol];

    if (defaultAddress) {
      return defaultAddress;
    }

    return isNativeToken(sourceToken) ? undefined : ERC_ZERO_ADDRESS;
  }, [isEligible, sourceToken, network, explicitTarget]);

  const requests = useMemo(
    () =>
      network && targetAddress ? [{ network, addresses: [targetAddress] }] : [],
    [network, targetAddress],
  );

  const { resolveToken } = useTokensLookup(requests, {
    enabled: requests.length > 0,
  });

  return useMemo(() => {
    if (!sourceToken || !network || !targetAddress) {
      return undefined;
    }

    const token = resolveToken(network.caipId, targetAddress);

    if (!token || getUniqueTokenId(token) === getUniqueTokenId(sourceToken)) {
      return undefined;
    }

    if (toId && getUniqueTokenId(token) !== toId) {
      return undefined;
    }

    return token;
  }, [sourceToken, network, targetAddress, resolveToken, toId]);
};
