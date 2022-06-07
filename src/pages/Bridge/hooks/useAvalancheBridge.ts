import {
  AssetType,
  BIG_ZERO,
  Blockchain,
  btcToSatoshi,
  getMinimumTransferAmount,
  satoshiToBtc,
  useBridgeSDK,
  useHasEnoughForGas,
} from '@avalabs/bridge-sdk';
import { BridgeAdapter } from './useBridge';
import { useAssetBalanceEVM } from '@src/pages/Bridge/hooks/useAssetBalanceEVM';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { useCallback, useMemo, useState } from 'react';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import Big from 'big.js';

/**
 * Hook for when the source is Avalanche
 */
export function useAvalancheBridge(amount: Big, bridgeFee: Big): BridgeAdapter {
  const {
    targetBlockchain,
    bridgeConfig,
    currentBlockchain,
    setTransactionDetails,
    currentAssetData,
  } = useBridgeSDK();

  const { createBridgeTransaction, transferAsset } = useBridgeContext();

  const isAvalancheBridge = currentBlockchain === Blockchain.AVALANCHE;
  const [txHash, setTxHash] = useState<string>();

  const sourceBalance = useAssetBalanceEVM(
    isAvalancheBridge ? currentAssetData : undefined,
    Blockchain.AVALANCHE
  );

  const { assetsWithBalances, loading } = useAssetBalancesEVM(
    Blockchain.AVALANCHE
  );

  const { activeAccount } = useAccountsContext();
  const { network } = useNetworkContext();
  const avalancheProvider = new JsonRpcBatchInternal(
    40,
    network?.rpcUrl,
    network?.chainId
  );
  const hasEnoughForNetworkFee = useHasEnoughForGas(
    isAvalancheBridge ? activeAccount?.addressC : undefined,
    avalancheProvider
  );

  const maximum = sourceBalance?.balance || BIG_ZERO;
  const minimum = useMemo(() => {
    if (!bridgeConfig.config) return BIG_ZERO;
    if (currentAssetData?.assetType === AssetType.ERC20) {
      return bridgeFee.mul(3);
    } else {
      return satoshiToBtc(
        getMinimumTransferAmount(
          Blockchain.AVALANCHE,
          bridgeConfig.config,
          btcToSatoshi(amount)
        )
      );
    }
  }, [amount, bridgeConfig.config, bridgeFee, currentAssetData?.assetType]);
  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;

  const transfer = useCallback(async () => {
    if (!currentAssetData) return Promise.reject();

    const timestamp = Date.now();
    const result = await transferAsset(
      amount,
      currentAssetData,
      () => {
        //not used
      },
      setTxHash
    );

    setTransactionDetails({
      tokenSymbol: currentAssetData.symbol,
      amount,
    });

    createBridgeTransaction({
      sourceChain: Blockchain.AVALANCHE,
      sourceTxHash: result.hash,
      sourceStartedAt: timestamp,
      targetChain: targetBlockchain,
      amount,
      symbol: currentAssetData.symbol,
    });

    return result.hash;
  }, [
    amount,
    createBridgeTransaction,
    currentAssetData,
    setTransactionDetails,
    targetBlockchain,
    transferAsset,
  ]);

  return {
    sourceBalance,
    assetsWithBalances,
    hasEnoughForNetworkFee,
    loading,
    receiveAmount,
    maximum,
    minimum,
    txHash,
    transfer,
  };
}
