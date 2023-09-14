import {
  BIG_ZERO,
  Blockchain,
  btcToSatoshi,
  getBtcAsset,
  getBtcTransaction,
  satoshiToBtc,
  useBridgeConfig,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { BitcoinInputUTXO, getMaxTransferAmount } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useInterval } from '@src/hooks/useInterval';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AssetBalance } from '../models';
import { BridgeAdapter } from './useBridge';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { BridgeTransferAssetHandler } from '@src/background/services/bridge/handlers/transferAsset';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

const NETWORK_FEE_REFRESH_INTERVAL = 60_000;

/**
 * Hook for Bitcoin to Avalanche transactions
 */
export function useBtcBridge(amountInBtc: Big): BridgeAdapter {
  const {
    currentAsset,
    setTransactionDetails,
    currentBlockchain,
    targetBlockchain,
  } = useBridgeSDK();
  const isBitcoinBridge =
    currentBlockchain === Blockchain.BITCOIN ||
    targetBlockchain === Blockchain.BITCOIN;

  const refetchFeeTrigger = useInterval(NETWORK_FEE_REFRESH_INTERVAL);
  const { request } = useConnectionContext();
  const { isDeveloperMode } = useNetworkContext();
  const { getNetworkFeeForNetwork } = useNetworkFeeContext();
  const { config } = useBridgeConfig();
  const { createBridgeTransaction } = useBridgeContext();
  const avalancheTokens = useTokensWithBalances(
    true,
    isDeveloperMode
      ? ChainId.AVALANCHE_TESTNET_ID
      : ChainId.AVALANCHE_MAINNET_ID
  );
  const btcTokens = useTokensWithBalances(
    true,
    isDeveloperMode ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN
  );
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const [btcBalance, setBtcBalance] = useState<AssetBalance>();
  const [btcBalanceAvalanche, setBtcBalanceAvalanche] =
    useState<AssetBalance>();
  const [utxos, setUtxos] = useState<BitcoinInputUTXO[]>();
  const [feeRates, setFeeRates] = useState<NetworkFee | null>();

  const feeRate: number = useMemo(() => {
    return Number(feeRates?.high.maxFee || 0n);
  }, [feeRates]);

  const maximum = useMemo(() => {
    if (!config || !activeAccount) return Big(0);
    const maxAmt = getMaxTransferAmount(
      utxos || [],
      // As long as the address type is the same (P2WPKH) it should not matter.
      config.criticalBitcoin.walletAddresses.btc,
      activeAccount.addressBTC,
      feeRate
    );
    return satoshiToBtc(maxAmt);
  }, [utxos, config, feeRate, activeAccount]);

  /** Network fee (in BTC) */
  const [networkFee, setNetworkFee] = useState<Big>();
  /** Amount minus network and bridge fees (in BTC) */
  const [receiveAmount, setReceiveAmount] = useState<Big>();
  const loading = !btcBalance || !btcBalanceAvalanche || !networkFee;
  const amountInSatoshis = btcToSatoshi(amountInBtc);

  const btcAsset = config && getBtcAsset(config);
  const assetsWithBalances = btcBalance ? [btcBalance] : [];

  useEffect(() => {
    async function loadFeeRates() {
      if (isBitcoinBridge && refetchFeeTrigger) {
        const rates = await getNetworkFeeForNetwork(
          isDeveloperMode ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN
        );
        setFeeRates(rates);
      }
    }

    loadFeeRates();
  }, [
    getNetworkFeeForNetwork,
    isBitcoinBridge,
    isDeveloperMode,
    refetchFeeTrigger,
  ]);

  // balances, utxos
  useEffect(() => {
    if (isBitcoinBridge && btcAsset && activeAccount) {
      const balance = btcTokens?.find((token) => token.symbol === 'BTC');

      if (balance) {
        setUtxos(balance.utxos);
        setBtcBalance({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(balance.balance.toNumber()),
          logoUri: balance.logoUri,
          price: balance.priceUSD,
          unconfirmedBalance: balance?.unconfirmedBalance
            ? satoshiToBtc(balance.unconfirmedBalance.toNumber())
            : satoshiToBtc(0),
        });
      }

      const btcAvalancheBalance = avalancheTokens?.find(
        (token) => token.symbol === 'BTC.b'
      );

      if (btcAvalancheBalance) {
        setBtcBalanceAvalanche({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcAvalancheBalance.balance?.toNumber() || 0),
          logoUri: btcAvalancheBalance.logoUri,
          price: btcAvalancheBalance.priceUSD,
          unconfirmedBalance: satoshiToBtc(
            btcAvalancheBalance.balance?.toNumber() || 0
          ),
        });
      }
    }
  }, [
    activeAccount,
    avalancheTokens,
    btcTokens,
    btcAsset,
    isBitcoinBridge,
    isDeveloperMode,
    request,
  ]);

  useEffect(() => {
    if (!isBitcoinBridge || !config || !activeAccount || !utxos) return;

    try {
      const btcTx = getBtcTransaction(
        config,
        activeAccount.addressBTC,
        utxos,
        amountInSatoshis,
        feeRate
      );

      setNetworkFee(satoshiToBtc(btcTx.fee));
      setReceiveAmount(satoshiToBtc(btcTx.receiveAmount));
    } catch (error) {
      // getBtcTransaction throws an error when the amount is too low or too high
      // so set these to 0
      setNetworkFee(BIG_ZERO);
      setReceiveAmount(BIG_ZERO);
    }
  }, [
    amountInSatoshis,
    activeAccount,
    config,
    isBitcoinBridge,
    utxos,
    feeRate,
  ]);

  const transfer = useCallback(async () => {
    if (!isBitcoinBridge || !config || !activeAccount || !btcAsset || !utxos)
      return;

    const timestamp = Date.now();
    const symbol = currentAsset || '';

    const result = await request<BridgeTransferAssetHandler>({
      method: ExtensionRequest.BRIDGE_TRANSFER_ASSET,
      params: [currentBlockchain, amountInBtc, btcAsset],
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
    isBitcoinBridge,
    config,
    activeAccount,
    btcAsset,
    utxos,
    currentAsset,
    request,
    currentBlockchain,
    amountInBtc,
    setTransactionDetails,
    createBridgeTransaction,
  ]);

  return {
    address: activeAccount?.addressBTC,
    sourceBalance: btcBalance,
    targetBalance: btcBalanceAvalanche,
    assetsWithBalances,
    hasEnoughForNetworkFee: true, // minimum calc covers this
    loading,
    networkFee,
    receiveAmount,
    maximum,
    price: btcBalance?.price,
    transfer,
  };
}
