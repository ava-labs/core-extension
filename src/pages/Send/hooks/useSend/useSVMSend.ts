/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo, useState } from 'react';

import { useWalletContext } from '@src/contexts/WalletProvider';
import { SendErrorMessage } from '@src/utils/send/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';

import { SendAdapterSVM } from './models';

export const useSvmSend: SendAdapterSVM = ({
  networkType,
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

  const wallet = useMemo(() => ({}), []);

  function setErrorAndEndValidating(message: SendErrorMessage) {
    setError(message);
    setIsValidating(false);
  }

  const buildTransaction = useCallback(
    async ({ address, amount, gasPrice, token }) => {
      throw 'not implemented';
    },
    [],
  );

  const parseTx = useCallback(async ({ address, amount, gasPrice, token }) => {
    throw 'not implemented';
  }, []);

  const validate = useCallback(async (options) => {
    return;
  }, []);

  const send = useCallback(async ({ address, amount, gasPrice, token }) => {
    console.log(
      'Sending',
      amount,
      'of',
      token,
      'to',
      address,
      'with gas @',
      gasPrice,
    );

    return 'hash';
  }, []);

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
