import Big from 'big.js';
import { utils } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { bigToBigInt } from '@avalabs/core-utils-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { resolve } from '@src/utils/promiseResolver';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { SendErrorMessage } from '@src/utils/send/models';
import { isValidPvmAddress } from '@src/utils/isAddressValid';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import type { AvalancheSendTransactionHandler } from '@src/background/services/wallet/handlers/avalanche_sendTransaction';

import { getMaxUtxoSet } from '../../utils/getMaxUtxos';
import { PVMSendOptions } from '../../models';
import { SendAdapterPVM } from './models';
import { correctAddressByPrefix } from '../../utils/correctAddressByPrefix';
import { FeeState } from '@avalabs/avalanchejs/dist/vms/pvm';

const PCHAIN_ALIAS = 'P' as const;
const AVAX_DECIMALS = 9;

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
  const [feeState, setFeeState] = useState<FeeState>();

  useEffect(() => {
    let isMounted = true;

    if (provider.isEtnaEnabled()) {
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
    } else {
      setFeeState(undefined);
    }

    return () => {
      isMounted = false;
    };
  }, [provider]);

  const wallet = useMemo(() => {
    return new Avalanche.AddressWallet(
      account.addressC,
      stripAddressPrefix(account.addressCoreEth),
      [stripAddressPrefix(account.addressPVM)],
      stripAddressPrefix(account.addressPVM),
      provider as Avalanche.JsonRpcProvider
    );
  }, [account, provider]);

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
      if (!gasPrice) {
        return feeState;
      }

      if (!feeState) {
        return;
      }

      return {
        ...feeState,
        price: gasPrice,
      };
    },
    [feeState]
  );

  const buildTransaction = useCallback(
    async ({ address, amount, gasPrice }: PVMSendOptions) => {
      const avax = provider.getAvaxID();
      const amountBigInt = bigToBigInt(Big(amount), AVAX_DECIMALS);
      const changeAddress = utils.parse(account.addressPVM)[2];
      const { utxos } = await getMaxUtxoSet(
        isLedgerWallet,
        provider,
        wallet,
        network,
        getFeeState(gasPrice)
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
    ]
  );

  const parseTx = useCallback(
    async ({ address, amount, gasPrice }: PVMSendOptions) => {
      const unsignedTx = await buildTransaction({
        address,
        amount,
        gasPrice,
      });

      const parsedTx = await Avalanche.parseAvalancheTx(
        unsignedTx,
        provider,
        account.addressPVM,
        { feeTolerance: 100 }
      );

      return parsedTx;
    },
    [buildTransaction, provider, account.addressPVM]
  );

  const validate = useCallback(
    async (options: PVMSendOptions) => {
      const { address, amount, gasPrice } = options;
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
            SendErrorMessage.EXCESSIVE_NETWORK_FEE
          );
        }
      }

      if (provider.isEtnaEnabled() && !feeState) {
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
          getFeeState(gasPrice)
        )
      );

      if (utxosError) {
        return setErrorAndEndValidating(SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
      }
      const amountBigInt = bigToBigInt(Big(amountToUse), 9);
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

      const parsedTx = await parseTx({ address, amount, gasPrice });

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
    ]
  );

  const send = useCallback(
    async ({ address, amount, gasPrice }: PVMSendOptions) => {
      checkFunctionAvailability();
      setIsSending(true);

      try {
        const unsignedTx = await buildTransaction({
          address,
          amount,
          gasPrice,
        });
        const manager = utils.getManagerForVM(unsignedTx.getVM());
        const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());

        const params = {
          transactionHex: `0x${Buffer.from(unsignedTx.toBytes()).toString(
            'hex'
          )}`,
          chainAlias: PCHAIN_ALIAS,
          utxos: unsignedTx.utxos.map((utxo) =>
            utils.bufferToHex(utxo.toBytes(codec))
          ),
          feeTolerance: 100,
        };
        return await request<AvalancheSendTransactionHandler>(
          {
            method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
            params,
          },
          {
            currentAddress: account.addressPVM,
          }
        );
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [buildTransaction, checkFunctionAvailability, request, account.addressPVM]
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
