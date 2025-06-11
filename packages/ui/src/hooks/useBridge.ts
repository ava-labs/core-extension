import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BridgeAsset,
  TokenType as BridgeTokenType,
} from '@avalabs/bridge-unified';
import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';

import { BridgeOptions, NetworkWithCaipId } from '@core/types';
import { isNFT, findMatchingBridgeAsset } from '@core/common';
import {
  useAnalyticsContext,
  useNetworkContext,
  useUnifiedBridgeContext,
} from '../contexts';
import { useTokensWithBalances } from './useTokensWithBalances';

interface Bridge {
  amount?: bigint;
  setAmount: (amount: bigint) => void;
  availableChainIds: string[];
  estimateGas: () => Promise<bigint>;
  isReady: boolean;
  targetChain?: NetworkWithCaipId;
  setTargetChain: (targetChain: NetworkWithCaipId) => void;
  asset?: BridgeAsset;
  setAsset: (asset: BridgeAsset) => void;
  sourceBalance?: Exclude<TokenWithBalance, NftTokenWithBalance>;
  possibleTargetChains: string[];
  minimum?: bigint;
  maximum?: bigint;
  receiveAmount?: bigint;
  bridgeFee?: bigint;
  bridgableTokens: Exclude<TokenWithBalance, NftTokenWithBalance>[];
  transferableAssets: BridgeAsset[];
  transfer: (
    options: BridgeOptions,
    newAmount?: bigint,
    newTargetChainId?: string,
    newAsset?: BridgeAsset,
  ) => Promise<string>;
}

export function useBridge(): Bridge {
  const { network, getNetwork } = useNetworkContext();
  const { capture } = useAnalyticsContext();
  const {
    availableChainIds,
    estimateTransferGas,
    getFee,
    isReady,
    transferableAssets,
    transferAsset,
    getMinimumTransferAmount,
  } = useUnifiedBridgeContext();
  const [amount, setAmount] = useState<bigint>();
  const [asset, setAsset] = useState<BridgeAsset>();
  const firstTargetChainId = Object.keys(asset?.destinations ?? {})[0] ?? '';
  const [targetChain, setTargetChain] = useState(
    firstTargetChainId ? getNetwork(firstTargetChainId) : undefined,
  );

  const [receiveAmount, setReceiveAmount] = useState<bigint>();
  const [maximum, setMaximum] = useState<bigint>();
  const [minimum, setMinimum] = useState<bigint>();
  const [bridgeFee, setBridgeFee] = useState<bigint>();
  const balances = useTokensWithBalances({
    network,
    forceShowTokensWithoutBalances: true,
  });

  const bridgableTokens = useMemo(() => {
    const nonNFTs = balances.filter(
      (t): t is Exclude<TokenWithBalance, NftTokenWithBalance> => !isNFT(t),
    );

    return nonNFTs.filter((t) =>
      findMatchingBridgeAsset(transferableAssets, t),
    );
  }, [balances, transferableAssets]);

  const sourceBalance = useMemo(() => {
    if (!asset) {
      return;
    }

    return bridgableTokens.find((token) => {
      if (
        asset.type === BridgeTokenType.NATIVE &&
        token.type === TokenType.NATIVE
      ) {
        return asset.symbol.toLowerCase() === token.symbol.toLowerCase();
      }

      if (
        asset.type === BridgeTokenType.ERC20 &&
        token.type === TokenType.ERC20
      ) {
        return asset.address?.toLowerCase() === token.address.toLowerCase();
      }

      return false;
    });
  }, [asset, bridgableTokens]);

  const possibleTargetChains = useMemo(() => {
    return Object.keys(asset?.destinations ?? {});
  }, [asset?.destinations]);

  useEffect(() => {
    setMaximum(sourceBalance?.balance);
  }, [sourceBalance?.balance]);

  useEffect(() => {
    let isMounted = true;

    if (asset && amount && targetChain) {
      getFee(asset.symbol, amount, targetChain.caipId).then((fee) => {
        if (!isMounted) {
          return;
        }

        setBridgeFee(fee);
        setReceiveAmount(amount - fee);
      });

      getMinimumTransferAmount(asset, amount, targetChain.caipId).then(
        (min) => {
          if (!isMounted) {
            return;
          }
          setMinimum(min);
        },
      );
    } else {
      setMinimum(undefined);
      setBridgeFee(undefined);
      setReceiveAmount(undefined);
    }

    return () => {
      isMounted = false;
    };
  }, [amount, asset, getFee, targetChain, getMinimumTransferAmount]);

  const estimateGas = useCallback(async () => {
    if (!asset?.symbol || !amount || !targetChain?.caipId) {
      return 0n;
    }

    return estimateTransferGas(asset.symbol, amount, targetChain?.caipId);
  }, [estimateTransferGas, targetChain?.caipId, asset?.symbol, amount]);

  const transfer = useCallback(
    async (
      options: BridgeOptions,
      newAmount?: bigint,
      newTargetChainId?: string,
      newAsset?: BridgeAsset,
    ) => {
      const targetChainId = targetChain?.caipId
        ? targetChain.caipId
        : newTargetChainId;
      const bridgeAmount = amount ?? newAmount;
      const bridgeAsset = asset ?? newAsset;
      if (!bridgeAmount) {
        throw new Error('No amount chosen');
      }

      if (!bridgeAsset) {
        throw new Error('No asset chosen');
      }

      if (!network?.caipId) {
        throw new Error('No source chain chosen');
      }

      if (!targetChainId) {
        throw new Error('No target chain chosen');
      }

      capture('unifedBridgeTransferStarted', {
        bridgeType: options.bridgeType,
        sourceBlockchain: network.caipId,
        targetBlockchain: targetChainId,
      });

      const hash = await transferAsset(
        bridgeAsset.symbol,
        bridgeAmount,
        targetChainId,
        options.gasSettings,
      );

      return hash;
    },
    [amount, targetChain, asset, network?.caipId, capture, transferAsset],
  );

  useEffect(() => {
    if (targetChain && possibleTargetChains.includes(targetChain.caipId)) {
      return;
    }

    if (possibleTargetChains[0]) {
      const foundChain = getNetwork(possibleTargetChains[0]);

      if (foundChain) {
        setTargetChain(foundChain);
      }
    }
  }, [getNetwork, targetChain, possibleTargetChains]);

  return {
    amount,
    setAmount,
    bridgableTokens: bridgableTokens,
    availableChainIds,
    bridgeFee,
    estimateGas,
    isReady,
    minimum,
    maximum,
    receiveAmount,
    asset,
    setAsset,
    sourceBalance,
    targetChain,
    setTargetChain,
    possibleTargetChains,
    transferableAssets,
    transfer,
  };
}
