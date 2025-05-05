import { Grow, Stack } from '@avalabs/core-k2-components';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { handleTxOutcome } from '@core/common';

import { CustomFees } from '@/components/common/CustomFees';
import { NotSupportedByWallet } from '@/components/common/NotSupportedByWallet';
import { FunctionNames } from '@/hooks/useIsFunctionAvailable';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useSetSendDataInParams } from '@/hooks/useSetSendDataInParams';
import { TokenWithBalancePVM } from '@avalabs/vm-module-types';
import { stringToBigint } from '@core/common';
import { usePvmSend } from '../hooks/useSend';
import { SendPagePropsWithWalletPVM } from '../models';
import { SendForm } from './SendForm';

export const SendPVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  networkFee,
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
  const [gasPrice, setGasPrice] = useState(networkFee.low.maxFeePerGas);

  const {
    error,
    isSending,
    isValid,
    isValidating,
    maxAmount,
    send,
    validate,
    estimatedFee,
  } = usePvmSend({
    network,
    from: fromAddress,
    maxFee,
    provider,
    nativeToken,
    account,
  });

  useEffect(() => {
    validate({ address, amount, gasPrice, token: nativeToken });

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
    gasPrice,
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
    } = await handleTxOutcome(
      send({ address, amount, gasPrice, token: nativeToken }),
    );

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
    gasPrice,
    nativeToken,
  ]);

  const inputAmount = useMemo(
    () =>
      amount ? stringToBigint(amount, nativeToken?.decimals ?? 18) : undefined,
    [nativeToken, amount],
  );

  const onFeeCustomized = useCallback((values: { maxFeePerGas: bigint }) => {
    setGasPrice(values.maxFeePerGas);
  }, []);

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
    >
      <Grow in={Boolean(estimatedFee)} mountOnEnter unmountOnExit>
        <Stack sx={{ py: 0, px: 2, mt: 2, width: '100%' }}>
          <CustomFees
            isCollapsible
            network={network}
            networkFee={networkFee}
            maxFeePerGas={gasPrice}
            maxGasPrice={(networkFee.baseFee ?? 0n) * 2n}
            estimatedFee={estimatedFee}
            limit={0}
            onChange={onFeeCustomized}
          />
        </Stack>
      </Grow>
    </SendForm>
  );
};
