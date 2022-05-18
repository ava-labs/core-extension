import Big from 'big.js';
import {
  AssetType,
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  useHasEnoughForGas,
  useMaxTransferAmount,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useCallback, useState } from 'react';
import { useAssetBalanceEVM } from './useAssetBalanceEVM';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { BridgeAdapter } from './useBridge';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getEthereumProvider } from '@src/background/services/network/getEthereumProvider';

/**
 * Hook for when the bridge source chain is Ethereum
 */
export function useEthBridge(amount: Big, bridgeFee: Big): BridgeAdapter {
  const {
    currentAsset,
    currentAssetData,
    setTransactionDetails,
    currentBlockchain,
  } = useBridgeSDK();

  const isEthereumBridge = currentBlockchain === Blockchain.ETHEREUM;

  const { createBridgeTransaction, transferAsset } = useBridgeContext();
  const sourceBalance = useAssetBalanceEVM(
    isEthereumBridge ? currentAssetData : undefined,
    Blockchain.ETHEREUM
  );
  const { assetsWithBalances, loading } = useAssetBalancesEVM(
    Blockchain.ETHEREUM
  );

  const { addresses } = useWalletContext();
  const { network } = useNetworkContext();
  const ethereumProvider = getEthereumProvider(network);
  const hasEnoughForNetworkFee = useHasEnoughForGas(
    isEthereumBridge ? addresses.addrC : undefined,
    ethereumProvider
  );

  const [wrapStatus, setWrapStatus] = useState<WrapStatus>(WrapStatus.INITIAL);
  const [txHash, setTxHash] = useState<string>();

  const maximum =
    useMaxTransferAmount(
      sourceBalance?.balance,
      addresses.addrC,
      ethereumProvider
    ) || undefined;
  const minimum = bridgeFee?.mul(3);
  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;

  const transfer = useCallback(async () => {
    if (!currentAssetData) return Promise.reject();

    const timestamp = Date.now();
    const symbol =
      currentAssetData.assetType === AssetType.NATIVE
        ? currentAssetData.wrappedAssetSymbol
        : currentAsset || '';

    const result = await transferAsset(
      amount,
      currentAssetData,
      setWrapStatus,
      setTxHash
    );

    setTransactionDetails({
      tokenSymbol: symbol,
      amount,
    });
    createBridgeTransaction({
      sourceChain: Blockchain.ETHEREUM,
      sourceTxHash: result.hash,
      sourceStartedAt: timestamp,
      targetChain: Blockchain.AVALANCHE,
      amount,
      symbol,
    });

    return result.hash;
  }, [
    amount,
    currentAssetData,
    createBridgeTransaction,
    currentAsset,
    setTransactionDetails,
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
    wrapStatus,
    txHash,
    transfer,
  };
}
