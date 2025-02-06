import type { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryParams } from '@src/hooks/useQueryParams';
import { isValidAddress } from '@src/utils/isAddressValid';
import { handleTxOutcome } from '@src/utils/handleTxOutcome';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useValidAddressFromParams } from '../hooks/useValidAddressFromParams';

import { useEVMSend } from '../hooks/useSend';
import type { SendOptions, SendPageProps } from '../models';
import { SendForm } from './SendForm';
import type {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
  TokenWithBalanceEVM,
} from '@avalabs/vm-module-types';
import { TokenType } from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';

type Props = SendPageProps<
  JsonRpcBatchInternal,
  NetworkTokenWithBalance,
  Exclude<TokenWithBalanceEVM, NftTokenWithBalance>[]
>;

export const SendEVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,

  onSuccess,
  onFailure,
  onApproved,
}: Props) => {
  const setStateInParams = useSetSendDataInParams();
  const params = useQueryParams();
  const tokenFromParams = tokenList.find((t) => {
    if (t.type === TokenType.ERC20) {
      return t.address === params.get('tokenAddress');
    } else if (t.type === TokenType.NATIVE) {
      return t.symbol === params.get('tokenSymbol');
    }
  });

  const addressFromParams = useValidAddressFromParams(isValidAddress);
  const [address, setAddress] = useState(addressFromParams);
  const [token, setToken] = useState(tokenFromParams);
  const [amount, setAmount] = useState(params.get('amount') ?? '');

  const { error, isSending, isValid, isValidating, maxAmount, send, validate } =
    useEVMSend({
      chainId: `0x${network.chainId.toString(16)}`,
      from: fromAddress,
      maxFee,
      nativeToken,
      provider,
    });

  useEffect(() => {
    validate({ address, token, amount } as SendOptions);

    if (address || token || amount) {
      setStateInParams({
        address,
        token,
        amount,
        options: { replace: true },
      });
    }
  }, [address, amount, token, validate, setStateInParams]);

  const onSend = useCallback(async () => {
    if (!isValid) {
      return;
    }

    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError,
    } = await handleTxOutcome(send({ address, token, amount } as SendOptions));

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
    () => (amount ? stringToBigint(amount, token?.decimals ?? 18) : undefined),
    [token, amount],
  );

  return (
    <SendForm
      address={address}
      inputAmount={inputAmount}
      token={token}
      tokenList={tokenList}
      onContactChanged={(contact) => setAddress(contact?.address ?? '')}
      onAmountChanged={(newAmount) => setAmount(newAmount)}
      onTokenChanged={(newToken) =>
        setToken(newToken as Exclude<TokenWithBalanceEVM, NftTokenWithBalance>)
      }
      isSending={isSending}
      isValid={isValid}
      isValidating={isValidating}
      error={error}
      maxAmount={maxAmount}
      onSend={onSend}
    />
  );
};
