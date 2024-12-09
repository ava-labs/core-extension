import { Avalanche } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { handleTxOutcome } from '@src/utils/handleTxOutcome';

import { SendPagePropsWithWalletAVM } from '../models';
import { SendForm } from './SendForm';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useQueryParams } from '@src/hooks/useQueryParams';
import { NotSupportedByWallet } from '@src/components/common/NotSupportedByWallet';
import { FunctionNames } from '@src/hooks/useIsFunctionAvailable';
import { useAvmSend } from '../hooks/useSend';
import { TokenWithBalanceAVM } from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';

export const SendAVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,
  account,
  onSuccess,
  onFailure,
  onApproved,
}: SendPagePropsWithWalletAVM<
  Avalanche.JsonRpcProvider,
  TokenWithBalanceAVM,
  [TokenWithBalanceAVM]
>) => {
  const setStateInParams = useSetSendDataInParams();
  const params = useQueryParams();
  const [address, setAddress] = useState<string>(params.get('address') ?? '');
  const [amount, setAmount] = useState('');

  const { error, isSending, isValid, isValidating, maxAmount, send, validate } =
    useAvmSend({
      network,
      from: fromAddress,
      maxFee,
      provider,
      nativeToken,
      account,
    });

  useEffect(() => {
    validate({ address, token: nativeToken, amount });

    if (address) {
      setStateInParams({
        token: nativeToken,
        address,
        options: { replace: true },
      });
    }
  }, [address, amount, validate, setStateInParams, nativeToken, account]);

  const onSend = useCallback(async () => {
    if (!isValid) {
      return;
    }

    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError,
    } = await handleTxOutcome(send({ address, token: nativeToken, amount }));

    if (isApproved) {
      onApproved();

      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [
    address,
    amount,
    isValid,
    nativeToken,
    onApproved,
    onFailure,
    onSuccess,
    send,
  ]);

  const inputAmount = useMemo(
    () =>
      amount ? stringToBigint(amount, nativeToken?.decimals ?? 9) : undefined,
    [nativeToken, amount],
  );

  if (account && !account.addressAVM) {
    return (
      <NotSupportedByWallet
        functionName={FunctionNames.TOKEN_DETAILS}
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  return (
    <SendForm
      address={address}
      inputAmount={inputAmount}
      token={nativeToken}
      tokenList={tokenList}
      onContactChanged={(contact) => {
        setAddress(contact?.addressXP ?? '');
      }}
      onAmountChanged={(newAmount) => setAmount(newAmount)}
      onTokenChanged={() => {}} // noop, AVAX has only one token
      isSending={isSending}
      isValid={isValid}
      isValidating={isValidating}
      error={error}
      maxAmount={maxAmount}
      onSend={onSend}
    />
  );
};
