import Big from 'big.js';
import { utils } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { bigToBigInt, resolve } from '@avalabs/core-utils-sdk';
import { useCallback, useMemo, useState } from 'react';

import { FeatureGates } from '@core/types';
import { useWalletContext } from '@core/ui';
import { SendErrorMessage } from '@core/types';
import {
  isValidAvmAddress,
  stripAddressPrefix,
  getMaxUtxoSet,
} from '@core/common';
import { DAppProviderRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useFeatureFlagContext } from '@core/ui';
import { AvalancheSendTransactionHandler } from '@core/service-worker';

import { SendAdapterAVM } from './models';
import { AVMSendOptions } from '../../models';
import { correctAddressByPrefix } from '../../utils/correctAddressByPrefix';

const XCHAIN_ALIAS = 'X' as const;

export const useAvmSend: SendAdapterAVM = ({
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

  const wallet = useMemo(() => {
    return new Avalanche.AddressWallet(
      account.addressC,
      stripAddressPrefix(account.addressCoreEth),
      [stripAddressPrefix(account.addressAVM)],
      stripAddressPrefix(account.addressAVM),
      provider as Avalanche.JsonRpcProvider,
    );
  }, [account, provider]);

  const checkFunctionAvailability = useCallback(() => {
    if (!featureFlags[FeatureGates.SEND_X_CHAIN]) {
      return SendErrorMessage.SEND_NOT_AVAILABLE;
    }
  }, [featureFlags]);

  function setErrorAndEndValidating(message: SendErrorMessage) {
    setError(message);
    setIsValidating(false);
  }

  const validate = useCallback(
    async (options: AVMSendOptions) => {
      const { address, token, amount } = options;

      const amountToUse = amount ? amount : '0';

      setIsValidating(true);
      setError(undefined);

      const errorReason = checkFunctionAvailability();

      if (errorReason) {
        return setErrorAndEndValidating(errorReason);
      }

      // using filtered UTXOs because there is size limit
      const [utxos, utxosError] = await resolve(
        getMaxUtxoSet(isLedgerWallet, provider, wallet, network),
      );

      if (utxosError) {
        return setErrorAndEndValidating(SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
      }

      // maxMount calculation
      const available = utxos?.balance.available ?? BigInt(0);
      const maxAvailable = available - maxFee;
      const amountBigInt = bigToBigInt(Big(amountToUse), token.decimals);
      const mavValue = maxAvailable.toString();
      setMaxAmount(mavValue);

      if (!address) {
        return setErrorAndEndValidating(SendErrorMessage.ADDRESS_REQUIRED);
      }
      if (!isValidAvmAddress(address)) {
        return setErrorAndEndValidating(SendErrorMessage.INVALID_ADDRESS);
      }

      if (!amount || amount === '0') {
        return setErrorAndEndValidating(SendErrorMessage.AMOUNT_REQUIRED);
      }

      if (maxAvailable < BigInt(0) || amountBigInt > maxAvailable) {
        return setErrorAndEndValidating(SendErrorMessage.INSUFFICIENT_BALANCE);
      }
      setError(undefined);
      setIsValidating(false);
    },
    [
      checkFunctionAvailability,
      isLedgerWallet,
      maxFee,
      network,
      provider,
      wallet,
    ],
  );

  const send = useCallback(
    async ({ address, token, amount }: AVMSendOptions) => {
      checkFunctionAvailability();

      setIsSending(true);
      try {
        const utxos = await getMaxUtxoSet(
          isLedgerWallet,
          provider,
          wallet,
          network,
        );
        const avax = provider.getAvaxID();
        const amountBigInt = bigToBigInt(Big(amount), token.decimals);
        const changeAddress = utils.parse(account.addressAVM)[2];

        const unsignedTx = wallet.baseTX({
          utxoSet: utxos.utxos,
          chain: XCHAIN_ALIAS,
          toAddress: correctAddressByPrefix(address, 'X-'),
          amountsPerAsset: {
            [avax]: amountBigInt,
          },
          options: {
            changeAddresses: [changeAddress],
          },
        });

        const manager = utils.getManagerForVM(unsignedTx.getVM());
        const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());

        const params = {
          transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
          chainAlias: XCHAIN_ALIAS,
          utxos: unsignedTx.utxos.map((utxo) =>
            utils.bufferToHex(utxo.toBytes(codec)),
          ),
        };

        return await request<AvalancheSendTransactionHandler>({
          method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
          params,
        });
      } finally {
        setIsSending(false);
      }
    },
    [
      account,
      checkFunctionAvailability,
      isLedgerWallet,
      network,
      provider,
      request,
      wallet,
    ],
  );

  return {
    error,
    isSending,
    isValid: !error,
    isValidating,
    maxAmount,
    send,
    validate,
  };
};
