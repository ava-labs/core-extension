import { useCallback, useEffect, useMemo, useState } from 'react';

import { handleTxOutcome } from '@core/utils';

import { SendPagePropsWithWalletSVM, SolanaSendOptions } from '../models';
import { SendForm } from './SendForm';
import { useSetSendDataInParams } from '@/hooks/useSetSendDataInParams';
import { useQueryParams } from '@/hooks/useQueryParams';
import { NotSupportedByWallet } from '@/components/common/NotSupportedByWallet';
import { FunctionNames } from '@/hooks/useIsFunctionAvailable';
import {
  TokenType,
  TokenWithBalanceSPL,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';
import { stringToBigint } from '@core/utils';
import { useSvmSend } from '../hooks/useSend/useSVMSend';
import { SolanaProvider } from '@avalabs/core-wallets-sdk';

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
