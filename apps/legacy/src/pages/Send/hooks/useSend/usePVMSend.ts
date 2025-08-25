import { utils } from '@avalabs/avalanchejs';
import { bigToBigInt } from '@avalabs/core-utils-sdk';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useConnectionContext } from '@core/ui';
import { useFeatureFlagContext } from '@core/ui';
import { useWalletContext } from '@core/ui';
import type { AvalancheSendTransactionHandler } from '@core/service-worker';
import {
  DAppProviderRequest,
  FeatureGates,
  SendErrorMessage,
} from '@core/types';
import {
  getMaxUtxoSet,
  isValidPvmAddress,
  resolve,
  stripAddressPrefix,
} from '@core/common';

import type { pvm } from '@avalabs/avalanchejs';
import { PVMSendOptions } from '../../models';
import { correctAddressByPrefix } from '../../utils/correctAddressByPrefix';
import { SendAdapterPVM } from './models';

const PCHAIN_ALIAS = 'P' as const;

export const usePvmSend: SendAdapterPVM = ({
  network,
  provider,
  account,
  maxFee,
}) => {
  const { request } = useConnectionContext();

  const { featureFlags } = useFeatureFlagContext();
  const { isLedgerWallet } = useWalletContext();

  const [error, setError] = useState<SendErrorMessage>();
  const [isValidating, setIsValidating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [maxAmount, setMaxAmount] = useState('0');
  const [estimatedFee, setEstimatedFee] = useState(0n);
  const [feeState, setFeeState] = useState<pvm.FeeState>();
  const [utxoSet, setUtxoSet] = useState<utils.UtxoSet>();

  const wallet = useMemo(() => {
    return new Avalanche.AddressWallet(
      account.addressC,
      stripAddressPrefix(account.addressCoreEth),
      [stripAddressPrefix(account.addressPVM)],
      stripAddressPrefix(account.addressPVM),
      provider as Avalanche.JsonRpcProvider,
    );
  }, [account, provider]);

  useEffect(() => {
    let isMounted = true;

    wallet
      .getUTXOs('P')
      .then((u) => {
        if (!isMounted) {
          return;
        }

        setUtxoSet(u);
      })
      .catch(() => {
        setError(SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
      });

    return () => {
      isMounted = false;
    };
  }, [wallet]);

  useEffect(() => {
    let isMounted = true;

    provider
      .getApiP()
      .getFeeState()
      .then((state) => {
        if (!isMounted) {
          return;
        }

        setFeeState(state);
      })
      .catch(() => {
        setError(SendErrorMessage.INVALID_NETWORK_FEE);
      });

    return () => {
      isMounted = false;
    };
  }, [provider]);

  const checkFunctionAvailability = useCallback(() => {
    if (!featureFlags[FeatureGates.SEND_P_CHAIN]) {
      return SendErrorMessage.SEND_NOT_AVAILABLE;
    }
  }, [featureFlags]);

  function setErrorAndEndValidating(message: SendErrorMessage) {
    setError(message);
    setIsValidating(false);
  }

  const getFeeState = useCallback(
    (gasPrice?: bigint) => {
      if (!gasPrice || !feeState) {
        return feeState;
      }

      return {
        ...feeState,
        price: gasPrice,
      };
    },
    [feeState],
  );

  const buildTransaction = useCallback(
    async ({ address, amount, gasPrice, token }: PVMSendOptions) => {
      const avax = provider.getAvaxID();
      const amountBigInt = bigToBigInt(Big(amount), token.decimals);
      const changeAddress = utils.parse(account.addressPVM)[2];
      const { utxos } = await getMaxUtxoSet(
        isLedgerWallet,
        provider,
        wallet,
        network,
        getFeeState(gasPrice),
        utxoSet,
      );

      return wallet.baseTX({
        utxoSet: utxos,
        chain: PCHAIN_ALIAS,
        toAddress: correctAddressByPrefix(address, 'P-'),
        amountsPerAsset: {
          [avax]: amountBigInt,
        },
        options: {
          changeAddresses: [changeAddress],
        },
        feeState:
          feeState && gasPrice ? { ...feeState, price: gasPrice } : feeState,
      });
    },
    [
      account.addressPVM,
      provider,
      wallet,
      feeState,
      isLedgerWallet,
      network,
      getFeeState,
      utxoSet,
    ],
  );

  const parseTx = useCallback(
    async ({ address, amount, gasPrice, token }: PVMSendOptions) => {
      const unsignedTx = await buildTransaction({
        address,
        amount,
        gasPrice,
        token,
      });

      const feeTolerance = getFeeTolerance(gasPrice, feeState);
      const parsedTx = await Avalanche.parseAvalancheTx(
        unsignedTx,
        provider,
        account.addressPVM,
        { feeTolerance },
      );

      return parsedTx;
    },
    [buildTransaction, provider, account.addressPVM, feeState],
  );

  const validate = useCallback(
    async (options: PVMSendOptions) => {
      const { address, amount, gasPrice, token } = options;
      const amountToUse = amount ? amount : '0';

      setIsValidating(true);
      setError(undefined);

      const errorReason = checkFunctionAvailability();

      if (errorReason) {
        return setErrorAndEndValidating(errorReason);
      }

      if (typeof gasPrice === 'bigint' && feeState) {
        if (feeState.price > gasPrice) {
          return setErrorAndEndValidating(SendErrorMessage.INVALID_NETWORK_FEE);
        } else if (gasPrice > feeState.price * 2n) {
          return setErrorAndEndValidating(
            SendErrorMessage.EXCESSIVE_NETWORK_FEE,
          );
        }
      }

      if (!feeState) {
        // Fee state has not been fetched yet, we can't proceed with other validations.
        // If there is an error with fetching the fee state when it's required,
        // that error is captured outside of the validate() function.
        return;
      }

      // using filtered UTXOs because there is size limit
      const [utxos, utxosError] = await resolve(
        getMaxUtxoSet(
          isLedgerWallet,
          provider,
          wallet,
          network,
          getFeeState(gasPrice),
          utxoSet,
        ),
      );

      if (utxosError) {
        return setErrorAndEndValidating(SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
      }
      const amountBigInt = bigToBigInt(Big(amountToUse), token.decimals);
      // maxMount calculation
      const available = utxos?.balance.available ?? BigInt(0);
      const maxAvailable = available - maxFee;
      setMaxAmount(maxAvailable.toString());

      if (!address) {
        return setErrorAndEndValidating(SendErrorMessage.ADDRESS_REQUIRED);
      }
      if (!isValidPvmAddress(address)) {
        return setErrorAndEndValidating(SendErrorMessage.INVALID_ADDRESS);
      }

      if (!amount || amount === '0') {
        return setErrorAndEndValidating(SendErrorMessage.AMOUNT_REQUIRED);
      }
      if (maxAvailable < BigInt(0) || amountBigInt > maxAvailable) {
        return setErrorAndEndValidating(SendErrorMessage.INSUFFICIENT_BALANCE);
      }

      setIsValidating(false);
      setError(undefined);

      const parsedTx = await parseTx({ address, amount, gasPrice, token });

      setEstimatedFee(parsedTx.txFee);
    },
    [
      checkFunctionAvailability,
      isLedgerWallet,
      maxFee,
      network,
      provider,
      wallet,
      getFeeState,
      parseTx,
      feeState,
      utxoSet,
    ],
  );

  const send = useCallback(
    async ({ address, amount, gasPrice, token }: PVMSendOptions) => {
      checkFunctionAvailability();
      setIsSending(true);

      try {
        const unsignedTx = await buildTransaction({
          address,
          amount,
          token,
          gasPrice,
        });
        const manager = utils.getManagerForVM(unsignedTx.getVM());
        const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());
        const feeTolerance = getFeeTolerance(gasPrice, feeState);
        const params = {
          transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
          chainAlias: PCHAIN_ALIAS,
          utxos: unsignedTx.utxos.map((utxo) =>
            utils.bufferToHex(utxo.toBytes(codec)),
          ),
          feeTolerance,
        };
        return await request<AvalancheSendTransactionHandler>({
          method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
          params,
        });
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [buildTransaction, checkFunctionAvailability, request, feeState],
  );

  return {
    error,
    isSending,
    isValid: !isValidating && !error,
    isValidating,
    maxAmount,
    send,
    validate,
    estimatedFee,
  };
};

const getFeeTolerance = (chosenGasPrice?: bigint, feeState?: pvm.FeeState) => {
  if (!chosenGasPrice || !feeState) {
    return;
  }

  const marketGasPrice = feeState.price;
  // Technically this should never be negative, but let's safe-guard
  const difference = Math.abs(Number(chosenGasPrice - marketGasPrice));

  // Cap between 1 and 100
  return Math.min(
    100,
    Math.max(1, Math.ceil((difference / Number(marketGasPrice)) * 100)),
  );
};
