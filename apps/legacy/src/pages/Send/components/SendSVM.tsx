import { useCallback, useEffect, useMemo, useState } from 'react';

import { handleTxOutcome, stringToBigint } from '@core/common';

import { NotSupportedByWallet } from '@/components/common/NotSupportedByWallet';
import { FunctionNames } from '@core/ui';
import { useQueryParams } from '@core/ui';
import { useSetSendDataInParams } from '@core/ui';
import { SolanaProvider } from '@avalabs/core-wallets-sdk';
import {
  TokenType,
  TokenWithBalanceSPL,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';
import { useSvmSend } from '../hooks/useSend/useSVMSend';
import { SendPagePropsWithWalletSVM, SolanaSendOptions } from '../models';
import { SendForm } from './SendForm';

type SolanaToken = TokenWithBalanceSVM | TokenWithBalanceSPL;

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
  SolanaProvider,
  TokenWithBalanceSVM,
  SolanaToken[]
>) => {
  const setStateInParams = useSetSendDataInParams();
  const params = useQueryParams();
  const tokenFromParams = tokenList.find((t) => {
    if (t.type === TokenType.SPL) {
      return t.address === params.get('tokenAddress');
    } else if (t.type === TokenType.NATIVE) {
      return t.symbol === params.get('tokenSymbol');
    }
  });
  const [address, setAddress] = useState<string>(params.get('address') ?? '');
  const [amount, setAmount] = useState(params.get('amount') ?? '');
  const [token, setToken] = useState<SolanaToken | undefined>(tokenFromParams);

  const {
    error,
    isSending,
    isValid,
    isValidating,
    minAmount,
    maxAmount,
    send,
    validate,
  } = useSvmSend({
    from: fromAddress,
    maxFee,
    provider,
    nativeToken,
    account,
  });

  useEffect(() => {
    validate({ address, amount, token } as SolanaSendOptions);

    if (address || amount || token) {
      setStateInParams({
        address,
        token,
        amount,
        options: { replace: true },
      });
    }
  }, [address, amount, validate, setStateInParams, account, token, tokenList]);

  const onSend = useCallback(async () => {
    if (!isValid) {
      return;
    }

    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError,
    } = await handleTxOutcome(
      send({ address, amount, token } as SolanaSendOptions),
    );

    if (isApproved) {
      onApproved();

      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, onApproved, onFailure, onSuccess, send, token]);

  const inputAmount = useMemo(
    () => (amount ? stringToBigint(amount, token?.decimals ?? 9) : undefined),
    [token?.decimals, amount],
  );

  if (account && !account.addressSVM) {
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
      token={token}
      tokenList={tokenList}
      onContactChanged={(contact) => {
        setAddress(contact?.addressSVM ?? '');
      }}
      onAmountChanged={(newAmount) => setAmount(newAmount)}
      onTokenChanged={(newToken) => setToken(newToken as SolanaToken)}
      isSending={isSending}
      isValid={isValid}
      isValidating={isValidating}
      error={error}
      minAmount={minAmount}
      maxAmount={maxAmount}
      onSend={onSend}
    />
  );
};
