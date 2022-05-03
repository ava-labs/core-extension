import { Big } from '@avalabs/avalanche-wallet-sdk';
import { TxSimple } from '@avalabs/blockcypher-sdk';
import {
  BIG_ZERO,
  Blockchain,
  btcToSatoshi,
  getBtcAsset,
  getBtcTransaction,
  getMinimumTransferAmount,
  satoshiToBtc,
  useBridgeConfig,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useInterval } from '@src/hooks/useInterval';
import { useCallback, useEffect, useState } from 'react';
import { AssetBalance, BALANCE_REFRESH_INTERVAL } from './models';
import { BridgeAdapter } from './useBridge';

/**
 * Hook for Bitcoin to Avalanche transactions
 */
export function useBtcBridge(amountInBtc: Big): BridgeAdapter {
  const { currentAsset, setTransactionDetails, currentBlockchain } =
    useBridgeSDK();
  const isBitcoinBridge = currentBlockchain === Blockchain.BITCOIN;

  const refetchInterval = useInterval(BALANCE_REFRESH_INTERVAL);
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
  const { config } = useBridgeConfig();
  const { createBridgeTransaction } = useBridgeContext();

  const [loading, setLoading] = useState(false);
  const [btcBalance, setBtcBalance] = useState<AssetBalance>();
  const [btcBalanceAvalanche, setBtcBalanceAvalanche] =
    useState<AssetBalance>();
  const [utxos, setUtxos] = useState<TxSimple[]>();
  const [btcAddress, setBtcAddress] = useState<string>();

  /** Network fee (in BTC) */
  const [networkFee, setFee] = useState<Big>();
  /** Amount minus network and bridge fees (in BTC) */
  const [receiveAmount, setReceiveAmount] = useState<Big>();
  /** Minimum transfer amount (in BTC) */
  const [minimum, setMinimum] = useState<Big>();

  const amountInSatoshis = btcToSatoshi(amountInBtc);

  const btcAsset = config && getBtcAsset(config);
  const assetsWithBalances = btcAsset
    ? [
        {
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: btcBalance?.balance,
        },
      ]
    : [];

  // balances, utxos, & btcAddress
  useEffect(() => {
    async function load() {
      if (isBitcoinBridge && btcAsset) {
        setLoading(true);
        const {
          bitcoinUtxos,
          btcAddress,
          btcBalanceAvalanche,
          btcBalanceBitcoin,
        } = await request({
          method: ExtensionRequest.BRIDGE_GET_BTC_BALANCES,
        });
        setBtcAddress(btcAddress);
        setUtxos(bitcoinUtxos);
        setBtcBalance({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcBalanceBitcoin),
        });
        setBtcBalanceAvalanche({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcBalanceAvalanche),
        });
        setLoading(false);
      }
    }

    load();
  }, [
    btcAsset,
    isBitcoinBridge,
    // network is here so balances will update when it changes
    network,
    // refetchInterval is here to ensure the balance is updated periodically
    refetchInterval,
    request,
  ]);

  useEffect(() => {
    if (!isBitcoinBridge || !config || !btcAddress || !utxos) return;

    try {
      const { fee, receiveAmount } = getBtcTransaction(
        config,
        btcAddress,
        utxos,
        amountInSatoshis
      );

      setFee(satoshiToBtc(fee));
      setReceiveAmount(satoshiToBtc(receiveAmount));
    } catch {
      // getBtcTransaction throws an error when the amount is too low
      // so set these to 0
      setFee(BIG_ZERO);
      setReceiveAmount(BIG_ZERO);
    }

    const minimumSatoshis = getMinimumTransferAmount(
      Blockchain.BITCOIN,
      config,
      amountInSatoshis
    );
    setMinimum(satoshiToBtc(minimumSatoshis));
  }, [amountInSatoshis, btcAddress, config, isBitcoinBridge, utxos]);

  const transfer = useCallback(async () => {
    if (!isBitcoinBridge || !config || !btcAddress || !btcAsset || !utxos)
      return;

    const timestamp = Date.now();
    const symbol = currentAsset || '';
    const { tx } = getBtcTransaction(
      config,
      btcAddress,
      utxos,
      amountInSatoshis
    );
    const unsignedTxHex = tx.toHex();
    const result = await request({
      method: ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC,
      params: [unsignedTxHex],
    });

    setTransactionDetails({
      tokenSymbol: symbol,
      amount: amountInBtc,
    });
    createBridgeTransaction({
      sourceChain: Blockchain.BITCOIN,
      sourceTxHash: result.hash,
      sourceStartedAt: timestamp,
      targetChain: Blockchain.AVALANCHE,
      amount: amountInBtc,
      symbol,
    });

    return result.hash;
  }, [
    amountInBtc,
    amountInSatoshis,
    btcAddress,
    btcAsset,
    config,
    createBridgeTransaction,
    currentAsset,
    isBitcoinBridge,
    request,
    setTransactionDetails,
    utxos,
  ]);

  return {
    address: btcAddress,
    sourceBalance: btcBalance,
    targetBalance: btcBalanceAvalanche,
    assetsWithBalances,
    hasEnoughForNetworkFee: true, // minimum calc covers this
    loading,
    networkFee,
    receiveAmount,
    maximum: btcBalance?.balance,
    minimum,
    transfer,
  };
}
