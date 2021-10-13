import {
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  BNInput,
  HorizontalFlex,
  SubTextTypography,
  ComponentSize,
  TextButton,
  TextArea,
} from '@avalabs/react-components';
import React, { useMemo } from 'react';
import { useSendAvax } from './useSendAvax';
import { SendAvaxConfirm } from './SendAvaxConfirm';
import { useState } from 'react';
import { BN } from 'bn.js';
import { useEffect } from 'react';
import {
  SendAvaxFormError,
  useSendAvaxFormErrors,
} from '@avalabs/wallet-react-components';
import { getAvaxBalanceTotal } from '../Wallet/utils/balanceHelpers';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useGetSendTypeFromParams } from '@src/hooks/useGetSendTypeFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { debounceTime, Subject } from 'rxjs';
import { TransactionFeeTooltip } from './TransactionFeeTooltip';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export function SendAvaxForm() {
  const sendType = useGetSendTypeFromParams();
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);
  const {
    maxAmount,
    targetChain,
    txId,
    setValues,
    error,
    canSubmit,
    address,
    submit,
    reset,
    sendFee,
    txs,
    gasLimit,
    gasPrice,
  } = useSendAvax();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState(new BN(0));
  const { amountError, addressError } = useSendAvaxFormErrors(error);
  const { avaxPrice } = useWalletContext();
  const [amountDisplayValue, setAmountDisplayValue] = useState('');

  function resetForm() {
    setAddressInput('');
    setAmountInput(undefined as any);
    setAmountDisplayValue('');
    reset();
  }

  const setValuesDebouncedSubject = useMemo(() => {
    const subject = new Subject<{ amount?: string; address?: string }>();
    subject.pipe(debounceTime(200)).subscribe(({ amount, address }) => {
      setValues(amount, address);
    });

    return subject;
  }, []);

  const showAmountErrorMessage =
    amountError.message &&
    amountError.message !== SendAvaxFormError.AMOUNT_REQUIRED;

  useEffect(() => {
    setValuesDebouncedSubject.next({
      amount: amountDisplayValue,
      address: addressInput,
    });
  }, [amountInput, addressInput]);

  return (
    <>
      <VerticalFlex align="center" width="100%">
        <TextArea
          size={ComponentSize.SMALL}
          margin="24px 0 0 0"
          label={'To'}
          value={addressInput}
          error={addressError.error}
          errorMessage={addressError.message}
          placeholder="Enter the address"
          onChange={(e) =>
            setAddressInput((e.nativeEvent.target as HTMLInputElement).value)
          }
        />
        <VerticalFlex margin="24px 0">
          <BNInput
            value={amountInput}
            label={'Amount'}
            error={amountError.error}
            errorMessage={showAmountErrorMessage ? amountError.message : ''}
            placeholder="Enter the amount"
            denomination={9}
            // TODO fix this once BNs have correct type from the backend
            max={maxAmount && new BN(maxAmount as any, 16)}
            onChange={(val) => {
              setAmountInput(val.bn);
              setAmountDisplayValue(val.amount);
            }}
          />
          {!showAmountErrorMessage || !amountError.error ? (
            <HorizontalFlex
              width={'100%'}
              justify={'space-between'}
              align={'center'}
              margin={'8px 0 0 0'}
            >
              <Typography size={14} height="16px">
                {currencyFormatter.format(
                  Number(amountDisplayValue || 0) * avaxPrice
                )}
              </Typography>
              <HorizontalFlex align="center">
                {sendFee && (
                  <SubTextTypography size={12} height="16px" margin="0 8px 0 0">
                    Transaction fee: ~
                    {getAvaxBalanceTotal(sendFee || new BN(0))} AVAX
                  </SubTextTypography>
                )}
                <TransactionFeeTooltip
                  gasPrice={gasPrice}
                  gasLimit={gasLimit}
                />
              </HorizontalFlex>
            </HorizontalFlex>
          ) : (
            ''
          )}
        </VerticalFlex>
        <SendAvaxConfirm
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          amount={amountDisplayValue as string}
          address={address as string}
          txId={txId}
          chain={targetChain}
          fee={sendFee ? getAvaxBalanceTotal(sendFee || new BN(0)) : ''}
          extraTxs={txs as any}
          amountUsd={currencyFormatter.format(
            Number(amountDisplayValue || 0) * avaxPrice
          )}
          onConfirm={() =>
            submit(amountDisplayValue as string).then(() => resetForm())
          }
        />
      </VerticalFlex>
      <VerticalFlex align="center" justify="flex-end" width="100%" grow="1">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => setShowConfirmation(true)}
          disabled={!canSubmit}
          margin="0 0 24px"
        >
          <Typography size={14} color="inherit">
            Continue
          </Typography>
        </PrimaryButton>
        <TextButton
          onClick={() => {
            resetForm();
          }}
        >
          Cancel
        </TextButton>
      </VerticalFlex>
    </>
  );
}
