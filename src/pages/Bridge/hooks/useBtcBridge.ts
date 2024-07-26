import {
  BIG_ZERO,
  Blockchain,
  btcToSatoshi,
  getBtcAsset,
  getBtcTransactionDetails,
  satoshiToBtc,
  useBridgeConfig,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import {
  BitcoinInputUTXOWithOptionalScript,
  getMaxTransferAmount,
} from '@avalabs/wallets-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AssetBalance } from '../models';
import { BridgeAdapter } from './useBridge';
import { TransactionPriority } from '@src/background/services/networkFee/models';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenWithBalanceBTC } from '@src/background/services/balances/models';

import { getBtcInputUtxos } from '@src/utils/send/btcSendUtils';
import { BitcoinSendTransactionHandler } from '@src/background/services/wallet/handlers/bitcoin_sendTransaction';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { useTranslation } from 'react-i18next';

/**
 * Hook for Bitcoin to Avalanche transactions
 */
export function useBtcBridge(amountInBtc: Big): BridgeAdapter {
  const { t } = useTranslation();
  const { setTransactionDetails, currentBlockchain } = useBridgeSDK();
  const isBitcoinBridge = currentBlockchain === Blockchain.BITCOIN;

  const { request } = useConnectionContext();
  const { bitcoinProvider, isDeveloperMode } = useNetworkContext();
  const { networkFee: currentFeeInfo } = useNetworkFeeContext();
  const { config } = useBridgeConfig();
  const { createBridgeTransaction } = useBridgeContext();
  const btcTokens = useTokensWithBalances(
    true,
    isDeveloperMode ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN
  );
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const [btcBalance, setBtcBalance] = useState<AssetBalance>();
  const [utxos, setUtxos] = useState<BitcoinInputUTXOWithOptionalScript[]>([]);

  const btcToken = useMemo(
    () =>
      btcTokens.find((tok): tok is TokenWithBalanceBTC => tok.symbol === 'BTC'),
    [btcTokens]
  );

  // Update the fee rate so we're able to calculate the
  // max. bridgable amount for the main bridge screen
  const feeRate: number = useMemo(() => {
    if (!currentFeeInfo) {
      return 0;
    }

    // Because BTC testnet fees are super high recently,
    // defaulting to cheaper preset makes testing easier.
    const preset: TransactionPriority = isDeveloperMode ? 'low' : 'high';

    return Number(currentFeeInfo[preset].maxFee);
  }, [currentFeeInfo, isDeveloperMode]);

  // Calculate the maximum bridgable BTC amount whwnever
  const maximum = useMemo(() => {
    if (!feeRate || !config || !activeAccount?.addressBTC) {
      return Big(0);
    }

    const maxAmt = getMaxTransferAmount(
      utxos,
      // As long as the address type is the same (P2WPKH) it should not matter.
      config.criticalBitcoin.walletAddresses.btc,
      activeAccount.addressBTC,
      feeRate
    );

    return satoshiToBtc(maxAmt);
  }, [utxos, config, feeRate, activeAccount?.addressBTC]);

  /** Amount minus network and bridge fees (in BTC) */
  const [receiveAmount, setReceiveAmount] = useState<Big>();
  const loading = !btcBalance || !currentFeeInfo || !feeRate;
  const amountInSatoshis = btcToSatoshi(amountInBtc);

  const btcAsset = config && getBtcAsset(config);
  const assetsWithBalances = btcBalance ? [btcBalance] : [];

  // Update balances for the UI
  useEffect(() => {
    if (!isBitcoinBridge || !btcAsset || !btcToken) {
      return;
    }

    setBtcBalance({
      symbol: btcAsset.symbol,
      asset: btcAsset,
      balance: satoshiToBtc(btcToken.balance.toNumber()),
      logoUri: btcToken.logoUri,
      price: btcToken.priceUSD,
      unconfirmedBalance: btcToken.unconfirmedBalance
        ? satoshiToBtc(btcToken.unconfirmedBalance.toNumber())
        : satoshiToBtc(0),
    });
  }, [btcToken, btcAsset, isBitcoinBridge]);

  // Filter UTXOs whenever balance or fee rate is updated
  // so we can calculate the max. bridgable amount.
  useEffect(() => {
    let isMounted = true;

    if (!bitcoinProvider || !feeRate || !btcToken) {
      return;
    }

    getBtcInputUtxos(bitcoinProvider, btcToken, feeRate)
      .then((_utxos) => {
        if (isMounted) {
          setUtxos(_utxos);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setUtxos([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [bitcoinProvider, btcToken, feeRate]);

  useEffect(() => {
    if (!isBitcoinBridge || !config || !activeAccount?.addressBTC || !utxos) {
      return;
    }

    try {
      const btcTx = getBtcTransactionDetails(
        config,
        activeAccount.addressBTC,
        utxos,
        amountInSatoshis,
        feeRate
      );

      setReceiveAmount(satoshiToBtc(btcTx.receiveAmount));
    } catch (error) {
      // getBtcTransaction throws an error when the amount is too low or too high
      // so set these to 0
      setReceiveAmount(BIG_ZERO);
    }
  }, [
    amountInSatoshis,
    activeAccount?.addressBTC,
    config,
    isBitcoinBridge,
    utxos,
    feeRate,
  ]);

  const transferBTC = useCallback(async () => {
    if (!config || !feeRate) {
      throw new Error('Bridge not ready');
    }

    if (amountInBtc.lte(0)) {
      throw new Error('Amount not provided');
    }

    if (!activeAccount?.addressBTC) {
      throw new Error('Unsupported account');
    }

    const symbol = 'BTC';
    const hash = await request<
      BitcoinSendTransactionHandler,
      DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
      string
    >({
      method: DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
      params: [
        config.criticalBitcoin.walletAddresses.btc,
        String(btcToSatoshi(amountInBtc)),
        feeRate,
        { customApprovalScreenTitle: t('Confirm Bridge') },
      ],
    });

    setTransactionDetails({
      tokenSymbol: symbol,
      amount: amountInBtc,
    });
    createBridgeTransaction({
      sourceChain: Blockchain.BITCOIN,
      sourceTxHash: hash,
      sourceStartedAt: Date.now(),
      targetChain: Blockchain.AVALANCHE,
      amount: amountInBtc,
      symbol,
    });

    return hash;
  }, [
    request,
    activeAccount?.addressBTC,
    t,
    amountInBtc,
    config,
    createBridgeTransaction,
    feeRate,
    setTransactionDetails,
  ]);

  const estimateGas = useCallback(
    async (amount: Big) => {
      if (!config || !activeAccount?.addressBTC) {
        return;
      }

      // Bitcoin's formula for fee is `transactionByteLength * feeRate`.
      // By setting the feeRate here to 1, we'll receive the transaction's byte length,
      // which is what we need to have the dynamic fee calculations in the UI.
      // Think of the byteLength as gasLimit for EVM transactions.
      const fakeFeeRate = 1;
      const { fee: byteLength } = getBtcTransactionDetails(
        config,
        activeAccount.addressBTC,
        utxos,
        btcToSatoshi(amount),
        fakeFeeRate
      );

      return BigInt(byteLength);
    },
    [activeAccount?.addressBTC, config, utxos]
  );

  return {
    address: activeAccount?.addressBTC,
    sourceBalance: btcBalance,
    assetsWithBalances,
    loading,
    receiveAmount,
    maximum,
    price: btcBalance?.price,
    estimateGas,
    transfer: transferBTC,
  };
}
