import Big from 'big.js';
import { utils } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/wallets-sdk';
import { bigToBigInt } from '@avalabs/utils-sdk';
import { useCallback, useMemo, useState } from 'react';

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

const PCHAIN_ALIAS = 'P';

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
    if (isLedgerWallet) {
      return SendErrorMessage.UNSUPPORTED_BY_LEDGER;
    }
  }, [featureFlags, isLedgerWallet]);

  function setErrorAndEndValidating(message: SendErrorMessage) {
    setError(message);
    setIsValidating(false);
  }

  const validate = useCallback(
    async (options: PVMSendOptions) => {
      const { address, token, amount } = options;

      setIsValidating(true);
      setError(undefined);

      const errorReason = checkFunctionAvailability();

      if (errorReason) {
        return setErrorAndEndValidating(errorReason);
      }

      if (!address) {
        return setErrorAndEndValidating(SendErrorMessage.ADDRESS_REQUIRED);
      }
      if (!isValidPvmAddress(address)) {
        return setErrorAndEndValidating(SendErrorMessage.INVALID_ADDRESS);
      }

      if (!amount || amount === '0') {
        return setErrorAndEndValidating(SendErrorMessage.AMOUNT_REQUIRED);
      }

      // using filtered UTXOs because there is size limit
      const [utxos, utxosError] = await resolve(
        getMaxUtxoSet(isLedgerWallet, provider, wallet, network)
      );

      if (utxosError) {
        return setErrorAndEndValidating(SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
      }
      const amountBigInt = bigToBigInt(Big(amount), token.decimals);
      // maxMount calculation
      const available = utxos?.balance.available ?? BigInt(0);
      const maxAvailable = available - maxFee;

      if (maxAvailable < BigInt(0) || amountBigInt > maxAvailable) {
        return setErrorAndEndValidating(SendErrorMessage.INSUFFICIENT_BALANCE);
      }

      setMaxAmount(maxAvailable.toString());
      setIsValidating(false);
      setError(undefined);
    },
    [
      checkFunctionAvailability,
      isLedgerWallet,
      maxFee,
      network,
      provider,
      wallet,
    ]
  );

  const send = useCallback(
    async ({ address, token, amount }: PVMSendOptions) => {
      checkFunctionAvailability();
      if (isLedgerWallet) {
        throw new Error(
          'Ledger does not support send function on P-Chain currently'
        );
      }

      setIsSending(true);

      try {
        const { utxos } = await getMaxUtxoSet(
          isLedgerWallet,
          provider,
          wallet,
          network
        );

        const avax = provider.getAvaxID();
        const amountBigInt = bigToBigInt(Big(amount), token.decimals);
        const changeAddress = utils.parse(account.addressPVM)[2];

        const unsignedTx = wallet.baseTX(
          utxos,
          PCHAIN_ALIAS,
          address,
          {
            [avax]: amountBigInt,
          },
          {
            changeAddresses: [changeAddress],
          }
        );
        const manager = utils.getManagerForVM(unsignedTx.getVM());
        const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());

        const params = {
          transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
          chainAlias: PCHAIN_ALIAS,
          utxos: unsignedTx.utxos.map((utxo) =>
            utils.bufferToHex(utxo.toBytes(codec))
          ),
        };
        const txID = (await request<AvalancheSendTransactionHandler>({
          method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
          params,
        })) as string;
        return txID;
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
    ]
  );

  return {
    error,
    isSending,
    isValid: !isValidating && !error,
    isValidating,
    maxAmount,
    send,
    validate,
  };
};
