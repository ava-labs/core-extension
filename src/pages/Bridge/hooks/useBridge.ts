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

import { NetworkWithCaipId } from '@src/background/services/network/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { isNFT } from '@src/background/services/balances/nft/utils/isNFT';

import { findMatchingBridgeAsset } from '../utils/findMatchingBridgeAsset';
import { BridgeOptions } from '../models';

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
  transfer: (options: BridgeOptions) => Promise<string>;
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
    firstTargetChainId ? getNetwork(firstTargetChainId) : undefined
  );

  const [receiveAmount, setReceiveAmount] = useState<bigint>();
  const [maximum, setMaximum] = useState<bigint>();
  const [minimum, setMinimum] = useState<bigint>();
  const [bridgeFee, setBridgeFee] = useState<bigint>();
  const balances = useTokensWithBalances({
    chainId: network?.chainId,
    forceShowTokensWithoutBalances: true,
  });

  const bridgableTokens = useMemo(() => {
    const nonNFTs = balances.filter(
      (t): t is Exclude<TokenWithBalance, NftTokenWithBalance> => !isNFT(t)
    );

    return nonNFTs.filter((t) =>
      findMatchingBridgeAsset(transferableAssets, t)
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
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, [
    amount,
    asset,
    getFee,
    targetChain,
    sourceBalance?.balance,
    getMinimumTransferAmount,
  ]);

  const estimateGas = useCallback(async () => {
    if (!asset?.symbol || !amount || !targetChain?.caipId) {
      return 0n;
    }

    return estimateTransferGas(asset.symbol, amount, targetChain?.caipId);
  }, [estimateTransferGas, targetChain?.caipId, asset?.symbol, amount]);

  const transfer = useCallback(
    async (options: BridgeOptions) => {
      if (!amount) {
        throw new Error('No amount chosen');
      }

      if (!asset) {
        throw new Error('No asset chosen');
      }

      if (!network?.caipId) {
        throw new Error('No source chain chosen');
      }

      if (!targetChain?.caipId) {
        throw new Error('No target chain chosen');
      }

      capture('unifedBridgeTransferStarted', {
        bridgeType: options.bridgeType,
        sourceBlockchain: network.caipId,
        targetBlockchain: targetChain.caipId,
      });

      const hash = await transferAsset(
        asset.symbol,
        amount,
        targetChain?.caipId,
        options.gasSettings
      );

      return hash;
    },
    [
      amount,
      asset,
      targetChain?.caipId,
      transferAsset,
      capture,
      network?.caipId,
    ]
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
