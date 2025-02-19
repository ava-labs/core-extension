import { useCallback, useEffect, useMemo, useState } from 'react';

import { handleTxOutcome } from '@src/utils/handleTxOutcome';

import { SendPagePropsWithWalletSVM } from '../models';
import { SendForm } from './SendForm';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useQueryParams } from '@src/hooks/useQueryParams';
import { NotSupportedByWallet } from '@src/components/common/NotSupportedByWallet';
import { FunctionNames } from '@src/hooks/useIsFunctionAvailable';
import {
  TokenWithBalanceSPL,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';
import { useSvmSend } from '../hooks/useSend/useSVMSend';

export const SendSVM = ({
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
}: SendPagePropsWithWalletSVM<
  any,
  TokenWithBalanceSVM,
  [TokenWithBalanceSVM | TokenWithBalanceSPL]
>) => {
  const setStateInParams = useSetSendDataInParams();
  const params = useQueryParams();
  const [address, setAddress] = useState<string>(params.get('address') ?? '');
  const [amount, setAmount] = useState('');

  const { error, isSending, isValid, isValidating, maxAmount, send, validate } =
    useSvmSend({
      networkType: 'mainnet', // TODO: fix
      from: fromAddress,
      maxFee,
      provider,
      nativeToken,
      account,
    });

  useEffect(() => {
    validate({ address, amount, token: nativeToken });

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
    } = await handleTxOutcome(send({ address, amount, token: nativeToken }));

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
    onApproved,
    onFailure,
    onSuccess,
    send,
    nativeToken,
  ]);

  const inputAmount = useMemo(
    () =>
      amount ? stringToBigint(amount, nativeToken?.decimals ?? 18) : undefined,
    [nativeToken, amount],
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
