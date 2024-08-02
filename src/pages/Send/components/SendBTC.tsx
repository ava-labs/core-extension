import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { stringToBN } from '@avalabs/core-utils-sdk';

import { handleTxOutcome } from '@src/utils/handleTxOutcome';
import { isBtcAddressInNetwork } from '@src/utils/isBtcAddressInNetwork';

import { useBtcSend } from '../hooks/useSend';
import { useValidAddressFromParams } from '../hooks/useValidAddressFromParams';
import { SendPageProps } from '../models';
import { SendForm } from './SendForm';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { TokenWithBalanceBTC } from '@avalabs/vm-module-types';

export const SendBTC = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,

  onSuccess,
  onFailure,
  onApproved,
}: SendPageProps<
  BitcoinProvider,
  TokenWithBalanceBTC,
  [TokenWithBalanceBTC]
>) => {
  const setStateInParams = useSetSendDataInParams();
  const addressValidator = useCallback(
    (add: string) => isBtcAddressInNetwork(add, !network.isTestnet),
    [network.isTestnet]
  );
  const addressFromParams = useValidAddressFromParams(addressValidator);
  const [address, setAddress] = useState(addressFromParams);
  const [amount, setAmount] = useState('');

  const { error, isSending, isValid, isValidating, maxAmount, send, validate } =
    useBtcSend({
      isMainnet: !network.isTestnet,
      from: fromAddress,
      maxFee,
      provider,
      nativeToken,
    });

  useEffect(() => {
    if (!nativeToken) {
      return;
    }

    validate({ address, amount });

    if (address) {
      setStateInParams({
        token: nativeToken,
        address,
        amount,
        options: { replace: true },
      });
    }
  }, [address, amount, validate, setStateInParams, nativeToken]);

  const onSend = useCallback(async () => {
    if (!isValid) {
      return;
    }

    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError,
    } = await handleTxOutcome(send({ address, amount }));

    if (isApproved) {
      onApproved();

      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, onApproved, onFailure, onSuccess, send]);

  const inputAmount = useMemo(
    () => (amount ? stringToBN(amount, nativeToken?.decimals ?? 8) : undefined),
    [nativeToken, amount]
  );

  return (
    <SendForm
      address={address}
      inputAmount={inputAmount}
      token={nativeToken}
      tokenList={tokenList}
      onContactChanged={(contact) => setAddress(contact?.addressBTC ?? '')}
      onAmountChanged={(newAmount) => setAmount(newAmount)}
      onTokenChanged={() => {}} // noop, BTC has only one token
      isSending={isSending}
      isValid={isValid}
      isValidating={isValidating}
      error={error}
      maxAmount={maxAmount}
      onSend={onSend}
    />
  );
};
