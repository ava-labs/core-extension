import { Avalanche } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { stringToBN } from '@avalabs/core-utils-sdk';

import { TokenWithBalancePVM } from '@src/background/services/balances/models';
import { handleTxOutcome } from '@src/utils/handleTxOutcome';

import { SendPagePropsWithWalletPVM } from '../models';
import { SendForm } from './SendForm';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useQueryParams } from '@src/hooks/useQueryParams';
import { usePvmSend } from '../hooks/useSend';
import { NotSupportedByWallet } from '@src/components/common/NotSupportedByWallet';
import { FunctionNames } from '@src/hooks/useIsFunctionAvailable';

export const SendPVM = ({
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
}: SendPagePropsWithWalletPVM<
  Avalanche.JsonRpcProvider,
  TokenWithBalancePVM,
  [TokenWithBalancePVM]
>) => {
  const setStateInParams = useSetSendDataInParams();
  const params = useQueryParams();
  const [address, setAddress] = useState<string>(params.get('address') ?? '');
  const [amount, setAmount] = useState('');

  const { error, isSending, isValid, isValidating, maxAmount, send, validate } =
    usePvmSend({
      network,
      from: fromAddress,
      maxFee,
      provider,
      nativeToken,
      account,
    });

  useEffect(() => {
    validate({ address, token: nativeToken, amount });

    if (address || amount) {
      setStateInParams({
        address,
        token: nativeToken,
        amount,
        options: { replace: true },
      });
    }
  }, [
    address,
    amount,
    validate,
    setStateInParams,
    nativeToken,
    account,
    tokenList,
  ]);

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
      amount ? stringToBN(amount, nativeToken?.decimals ?? 18) : undefined,
    [nativeToken, amount]
  );

  if (account && !account.addressPVM) {
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
        if (contact?.addressXP) setAddress(contact.addressXP);
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
